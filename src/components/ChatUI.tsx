import { Avatar, AvatarFallback } from '@undp/design-system-react/Avatar';
import { Bubble, BubbleContent, BubbleGroup } from '@undp/design-system-react/Bubble';
import { Button } from '@undp/design-system-react/Button';
import { Input } from '@undp/design-system-react/Input';
import { Message, MessageContent, MessageGroup } from '@undp/design-system-react/Message';
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@undp/design-system-react/MessageScroller';
import { P } from '@undp/design-system-react/Typography';
import { Bot, MessagesSquare, Send, User, X } from 'lucide-react';
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
        <div className='mb-4 w-150 rounded-lg border border-stroke bg-surface'>
          <div className='flex items-center justify-between gap-8 border-stroke border-b p-4'>
            <P weight='bold' marginBottom='none' size='lg'>
              Chatbot
            </P>
            <Button onClick={() => setOpen(false)} variant='icon' className='p-0'>
              <X size={24} />
            </Button>
          </div>
          <MessageScrollerProvider>
            <MessageScroller className='min-h-120 w-full bg-background'>
              <MessageScrollerViewport>
                <MessageScrollerContent className='p-4'>
                  {conversation.map((item, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: index is the unique identifier
                    <MessageScrollerItem key={idx}>
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
                              <Bubble variant={item.sender === 'user' ? 'secondary' : 'surface'}>
                                <BubbleContent>{item.message}</BubbleContent>
                              </Bubble>
                            </BubbleGroup>
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
      <button
        onClick={() => setOpen(!open)}
        type='button'
        className='flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-primary text-content-reverse hover:bg-primary-hover'
      >
        {open ? <X size={32} /> : <MessagesSquare size={32} />}
      </button>
    </div>
  );
}
