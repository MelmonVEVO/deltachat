import { useState } from 'react'

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool',
  SYSTEM = 'system'
}

export interface Message {
  role: MessageRole;
  content: string;
}

interface Options {
  num_keep?: number;
  seed?: number;
  num_predict?: number;
  top_k?: number;
  top_p?: number;
  min_p?: number;
  typical_p?: number;
  repeat_last_n?: number;
  temperature?: number;
  repeat_penalty?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  mirostat?: number;
  mirostat_tau?: number;
  mirostat_eta?: number;
  penalize_newline?: boolean;
  stop?: string[];
  numa?: boolean;
  num_ctx?: number;
  num_batch?: number;
  num_gpu?: number;
  main_gpu?: number;
  low_vram?: boolean;
  vocab_only?: boolean;
  use_mmap?: boolean;
  use_mlock?: boolean;
  num_thread?: number;
}

interface Payload {
  model: string;
  messages: Message[];
  stream: boolean;
  options?: Options;
}

interface ResponseData {
  model: string;
  created_at: string;
  message: Message;
  done_reason: string;
  done: boolean;
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
  prompt_eval_duration: number;
  eval_count: number;
  eval_duration: number;
}

const useLLM = () => {
  const LLMEndpoint = 'http://localhost:11434/api/chat'
  // const [LLMEndpoint, setLLMEndpoint] = useState<string>('')
  // const [model, setModel] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const sendMessageToLLM = async (messages: Message[], model: string, stream: boolean, options?: Options): Promise<ResponseData> => {
    setLoading(true)

    const payload: Payload = {
      model,
      messages,
      stream,
      options
    }

    const response = await fetch(
      LLMEndpoint,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)

      }
    )

    setLoading(false)

    if (!response.ok) {
      return Promise.reject('Proompting failed! Status: ' + response.statusText)
    }

    const data: ResponseData = await response.json()
    return data
  }

  return { loading, sendMessageToLLM }
}

export default useLLM
