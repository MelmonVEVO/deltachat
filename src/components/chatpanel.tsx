import { FormEvent, ReactNode, useState } from 'react'
import useLLM, { Message, MessageRole } from '../hooks/useLLM'
import Markdown from 'react-markdown'

const SpeechBox = ({ user, children }: { user: MessageRole, children: ReactNode }) => (
  <div className={`my-6 flex ${user === MessageRole.USER ? 'justify-end' : 'justify-start'}`}>
    <div className='p-4 bg-slate-300 max-w-7xl text-wrap'>
      {children}
    </div>
  </div>
)

const ChatPanel = () => {
  const [userProompt, setUserProompt] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const { loading, sendMessageToLLM } = useLLM()
  const models = ['llama3.1:8b']
  // const models = useState<string[]>()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return
    if (!userProompt.trim()) return

    const newMessages = [...messages, { role: MessageRole.USER, content: userProompt }]
    setUserProompt('')
    setMessages(newMessages)

    await sendMessageToLLM(newMessages, models[0], false).then((value) => {
      setMessages((prev) => [...prev, value.message])
    }).catch((reason: string) => {
      console.error(reason)
    })
  }

  return (
    <div className='flex flex-col justify-between grow bg-slate-900 p-24'>
      <div
        className='flex flex-col p-2 space-x-4'
      >
        {messages.map((message) => (
          <SpeechBox user={message.role}>
            <Markdown
            >
              {message.content}
            </Markdown>
          </SpeechBox>
        ))}
      </div>
      <div className='flex justify-center items-center p-2 w-full'>
        <form
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            className='m-4 p-1 bg-slate-400 outline-slate-700 w-96'
            value={userProompt}
            onChange={(e) => setUserProompt(e.target.value)}
            placeholder='What would you like to ask?'
          />
          <button
            type='submit'
            className='m-2 p-2 bg-slate-400'
            disabled={loading}
          >
            Send
          </button>
        </form>
        {loading && <div>Waiting...</div>}
      </div>
    </div>
  )
}

export default ChatPanel
