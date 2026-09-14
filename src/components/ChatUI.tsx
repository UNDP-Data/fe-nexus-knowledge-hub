import { Button } from '@undp/design-system-react/Button';
import { Input } from '@undp/design-system-react/Input';
import {
  Message,
  MessageContent,
  MessageGroup,
  MessageHeader,
} from '@undp/design-system-react/Message';
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@undp/design-system-react/MessageScroller';
import { P } from '@undp/design-system-react/Typography';
import { MessagesSquare, Send, X } from 'lucide-react';
import { useState } from 'react';

interface ConversationDataType {
  message: string;
  sender: 'user' | 'bot';
}

export function ChatbotUI() {
  const [open, setOpen] = useState<boolean>(false);
  const [inputString, setInputString] = useState('');
  const [conversation, setConversation] = useState<ConversationDataType[]>([]);
  return (
    <div className='fixed right-8 bottom-8 z-5 flex flex-col items-end'>
      {open && (
        <div className='mb-4 w-150 bg-background shadow-md'>
          <div className='flex items-center justify-between gap-8 bg-surface-sm p-4'>
            <P weight='bold' marginBottom='none' size='base'>
              Chatbot
            </P>
            <Button onClick={() => setOpen(false)} variant='icon' className='p-0'>
              <X />
            </Button>
          </div>
          <MessageScrollerProvider>
            <MessageScroller className='min-h-120 w-full'>
              <MessageScrollerViewport>
                <MessageScrollerContent className='p-4'>
                  {conversation.map((item, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                    <MessageScrollerItem key={idx}>
                      <MessageGroup>
                        <Message align={item.sender === 'user' ? 'end' : 'start'}>
                          <MessageContent className='w-fit max-w-full'>
                            <MessageHeader
                              className={
                                item.sender === 'user'
                                  ? 'text-accent-blue text-base'
                                  : 'text-accent-orange text-base'
                              }
                            >
                              {item.sender === 'user' ? 'Me' : 'UNDP'}
                            </MessageHeader>
                            <div className='flex w-fit rounded-lg bg-surface px-3 py-2'>
                              <P marginBottom='none' size='base'>
                                {item.message}
                              </P>
                            </div>
                          </MessageContent>
                        </Message>
                      </MessageGroup>
                    </MessageScrollerItem>
                  ))}
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
                  setConversation((prev) => [...prev, { message: inputString, sender: 'user' }]);
                  setInputString('');
                }
              }}
            />
            <Button
              variant='icon'
              arrow={false}
              className='p-0'
              disabled={inputString.trim() === ''}
              onClick={() => {
                if (inputString.trim() === '') return;
                setConversation((prev) => [...prev, { message: inputString, sender: 'user' }]);
                setInputString('');
              }}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  if (inputString.trim() === '') return;
                  setConversation((prev) => [...prev, { message: inputString, sender: 'user' }]);
                  setInputString('');
                }
              }}
            >
              <Send />
            </Button>
          </div>
        </div>
      )}
      <Button onClick={() => setOpen(!open)} variant='primary' arrow={false} rounded='full'>
        {open ? <X /> : <MessagesSquare />}
      </Button>
    </div>
  );
}
