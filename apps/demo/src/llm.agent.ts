import { Injectable } from '@nestjs/common';

@Injectable()
export default class LlmAgent {

  invoke(prompt: string) {
    return Promise.resolve(prompt ? 'You said: ' + prompt : 'I do not know what you said');
  }
}