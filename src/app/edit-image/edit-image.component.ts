import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit {
  prompt: any = '';
  happy: any = '';
  source = '../../assets/My project-1.jpg';

  constructor() {}

  reset() {
    this.source = '../../assets/My project-1.jpg';
  }
  async editImage() {
    if (!prompt) {
      alert('Please enter a prompt!');
    } else {
      let complete_prompt;
      complete_prompt =
        'face with glasses.\r\nIs this face wearing glasses?\r\nYes\r\nface without glasses.\r\nIs this face wearing glasses?\r\nNo' +
        this.prompt +
        '.\r\nIs this face wearing glasses?';

      await axios
        .post(
          'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
          {
            prompt: complete_prompt,
          }
        )
        .then(async (response) => {
          let glasses = await response.data.response.comp;
          if (glasses.includes('yes') || glasses.includes('Yes')) {
            complete_prompt =
              'face with smile.\r\nIs this face happy?\r\nYes\r\nface without smile.\r\nIs this face happy?\r\nNo\r\nhappy face.\r\nIs this face happy?\r\nsad face.\r\nIs this face happy?\r\nNo\r\n' +
              this.prompt +
              '.\r\nIs this face happy?';
            await axios
              .post(
                'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
                {
                  prompt: complete_prompt,
                }
              )
              .then(async (response) => {
                let happy = await response.data.response.comp;
                if (happy.includes('yes') || happy.includes('Yes')) {
                  this.source = '../../assets/My project-3.jpg';
                } else {
                  complete_prompt =
                    'surprized face.\r\nIs this face surprised?\r\nYes\r\nsurprized face.\r\nIs this face surprised?\r\nYes\r\nhappy face.\r\nIs this face surprised?\r\nNo' +
                    this.prompt +
                    '.\r\nIs this face surprised?';
                  await axios
                    .post(
                      'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
                      {
                        prompt: complete_prompt,
                      }
                    )
                    .then(async (response) => {
                      let suprised = await response.data.response.comp;
                      if (
                        suprised.includes('yes') ||
                        suprised.includes('Yes')
                      ) {
                        this.source = '../../assets/My project-4.jpg';
                      } else {
                        this.source = '../../assets/My project-2.jpg';
                      }
                    });
                }
              });
          } else {
            this.source = '../../assets/My project-1.jpg';
          }
        });
    }
  }

  ngOnInit(): void {}
}
