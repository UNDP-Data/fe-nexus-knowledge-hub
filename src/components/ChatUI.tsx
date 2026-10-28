import { useMutation, useQuery } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@undp/design-system-react/Avatar';
import { Bubble, BubbleContent, BubbleGroup } from '@undp/design-system-react/Bubble';
import { Button } from '@undp/design-system-react/Button';
import { Drawer, DrawerBody, DrawerContent } from '@undp/design-system-react/Drawer';
import { Input } from '@undp/design-system-react/Input';
import { MarkdownRenderer } from '@undp/design-system-react/MarkdownRenderer';
import { Message, MessageContent, MessageGroup } from '@undp/design-system-react/Message';
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@undp/design-system-react/MessageScroller';
import { Spinner } from '@undp/design-system-react/Spinner';
import { A, P } from '@undp/design-system-react/Typography';
import { Bot, MessagesSquare, Send, User, X } from 'lucide-react';
import { useState } from 'react';
import { API_BASE } from '@/constants';
import type { Publication } from '@/Types';
import { ReportDetail } from './ResourceDetail';

interface ConversationDataType {
  message: string;
  sender: 'user' | 'bot';
  citations?: {
    citation_number: number;
    document_id: string;
    title: string;
    url: string;
    document_url: string;
    document_urls: string[];
    banner_url: string;
  }[];
  isError?: boolean;
}

interface CitationDataType {
  banner_url: string;
  citation_number: number;
  document_id: string;
  document_url: string;
  document_urls: string[];
  title: string;
  url: string;
}

interface ChatResponse {
  answer: string;
  citations: CitationDataType[];
}

function addCitations(
  message: string,
  citations: {
    citation_number: number;
    title: string;
    document_id: string;
  }[],
) {
  return message.replace(/\[(\d+)\]/g, (match, number) => {
    const citation = citations.find((c) => c.citation_number === Number(number));
    if (!citation?.document_id) return match;
    return `[cite:${citation.title}:${citation.document_id}](/all-resources?reportId=${citation.document_id})`;
  });
}

function ChatMessage({
  item,
  setClickResource,
}: {
  item: ConversationDataType;
  setClickResource?: (_d: string) => void;
}) {
  const itemWithCitations = addCitations(item.message, item.citations || []);
  return (
    <MessageGroup>
      <Message align={item.sender === 'user' ? 'end' : 'start'}>
        <Avatar>
          {item.sender === 'user' ? (
            <AvatarFallback border={false} color='secondary'>
              <User size={20} />
            </AvatarFallback>
          ) : (
            <AvatarFallback border={false} color='primary'>
              <Bot size={20} />
            </AvatarFallback>
          )}
        </Avatar>
        <MessageContent className='w-full'>
          <BubbleGroup className='w-full'>
            <Bubble color={item.sender === 'user' ? 'secondary' : 'surface'}>
              <BubbleContent className={item.isError ? 'text-error' : undefined}>
                <MarkdownRenderer
                  text={itemWithCitations || ''}
                  size='base'
                  classNames={{
                    p: 'mb-0!',
                  }}
                  components={{
                    a: ({ href, children }) => {
                      if (String(children).startsWith('cite:')) {
                        const value = String(children).replace(/^cite:/, '');
                        const separatorIndex = value.lastIndexOf(':');

                        const title = value.slice(0, separatorIndex);
                        const documentId = value.slice(separatorIndex + 1);

                        return (
                          // biome-ignore lint/a11y/noStaticElementInteractions: This is an exception in chat bot
                          // biome-ignore lint/a11y/useKeyWithClickEvents: This is an exception in chat bot
                          <span
                            onClick={() => {
                              setClickResource?.(documentId);
                            }}
                            className='inline-block max-w-32 cursor-pointer items-center gap-1 truncate rounded-full bg-surface-hard px-1.5 py-0.5 font-medium text-content-secondary text-xs no-underline hover:text-primary'
                          >
                            {title}
                          </span>
                        );
                      }

                      return (
                        <A href={href} target='_blank' rel='noopener noreferrer'>
                          {children}
                        </A>
                      );
                    },
                  }}
                />
              </BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
    </MessageGroup>
  );
}

function useReportData(resourceId: string) {
  return useQuery({
    queryKey: ['get-resource', resourceId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/publications/${resourceId}`);
      const data = (await response.json()) as Publication;
      return data;
    },
  });
}

function ReportDrawer({ resourceId }: { resourceId: string }) {
  const { data, isLoading, isError } = useReportData(resourceId);
  if (isError) return <>Error loading resource</>;
  if (isLoading || !data) return <Spinner size='lg' className='mx-auto my-20' />;
  return <ReportDetail report={data} />;
}

export function ChatbotUI() {
  const [open, setOpen] = useState<boolean>(false);
  const [inputString, setInputString] = useState('');
  const [clickedResource, setClickResource] = useState<string | undefined>(undefined);
  const [conversation, setConversation] = useState<ConversationDataType[]>([
    {
      message:
        'Hello! I’m the AI assistant for the Nexus Knowledge Hub. Ask me anything about the HDP Nexus, and I’ll draw on 500+ curated resources to help you find what you need.',
      sender: 'bot',
    },
  ]);

  const sendMessage = useMutation({
    mutationFn: async (_message: string) => {
      const messages = [
        ...conversation
          .filter((item) => !item.isError)
          .filter(
            (item) =>
              item.message !==
              'Hello! I’m the AI assistant for the Nexus Knowledge Hub. Ask me anything about the HDP Nexus, and I’ll draw on 500+ curated resources to help you find what you need.',
          )
          .map((item) => ({
            role: item.sender === 'user' ? 'user' : 'assistant',
            content: item.message,
          })),
      ];
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
      if (!response.ok) {
        throw new Error(`Request failed (${response.status}): ${await response.text()}`);
      }
      return (await response.json()) as ChatResponse;
    },
    onMutate: (message) => {
      setConversation((prev) => [...prev, { message, sender: 'user' }]);
      setInputString('');
    },
    onSuccess: (data) => {
      setConversation((prev) => [
        ...prev,
        { message: data.answer, sender: 'bot', citations: data.citations },
      ]);
    },
    onError: (error) => {
      console.error('Chat request failed:', error);
      setConversation((prev) => [
        ...prev,
        { message: 'Sorry, something went wrong. Please try again.', sender: 'bot', isError: true },
      ]);
    },
  });

  const handleSend = () => {
    const message = inputString.trim();
    if (message === '' || sendMessage.isPending) return;
    sendMessage.mutate(message);
  };
  return (
    <>
      <div className='fixed right-8 bottom-8 z-5 flex flex-col items-end'>
        {open && (
          <div className='mb-4 flex h-100 w-150 flex-col rounded-lg border border-stroke bg-surface lg:h-150'>
            <div className='flex items-center justify-between gap-8 border-stroke border-b p-4'>
              <P weight='bold' marginBottom='none' size='lg'>
                NexusChat
              </P>
              <Button
                onClick={() => setOpen(false)}
                variant='icon'
                padding='none'
                className='bg-transparent'
              >
                <X size={24} />
              </Button>
            </div>
            <MessageScrollerProvider>
              <MessageScroller className='w-full bg-background'>
                <MessageScrollerViewport>
                  <MessageScrollerContent className='p-4'>
                    {conversation.map((item, idx) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                      <MessageScrollerItem key={idx}>
                        <ChatMessage item={item} setClickResource={setClickResource} />
                      </MessageScrollerItem>
                    ))}
                    {sendMessage.isPending && (
                      <MessageScrollerItem>
                        <ChatMessage item={{ message: 'Thinking…', sender: 'bot' }} />
                      </MessageScrollerItem>
                    )}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
              </MessageScroller>
            </MessageScrollerProvider>
            <div className='flex gap-2 border-stroke border-t p-4'>
              <Input
                value={inputString}
                onChange={(value) => setInputString(value.target.value)}
                placeholder='Ask a question'
                variant='light'
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    if (inputString.trim() === '') return;
                    handleSend();
                  }
                }}
              />
              <Button
                variant='icon'
                endIcon='none'
                className='bg-transparent'
                padding='none'
                disabled={inputString.trim() === '' || sendMessage.isPending}
                onClick={() => {
                  if (inputString.trim() === '') return;
                  handleSend();
                }}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    if (inputString.trim() === '') return;
                    handleSend();
                  }
                }}
              >
                <Send />
              </Button>
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          type='button'
          className='flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary text-content-reverse hover:bg-primary-hover'
        >
          {open ? <X size={32} /> : <MessagesSquare size={32} />}
        </button>
      </div>
      <Drawer
        direction='right'
        open={!!clickedResource}
        onClose={() => {
          setClickResource(undefined);
        }}
      >
        <DrawerContent>
          <DrawerBody>
            {clickedResource && <ReportDrawer resourceId={clickedResource} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
