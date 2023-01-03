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
  loading = false;

  constructor() {}

  reset() {
    this.source = '../../assets/My project-1.jpg';
  }
  async editImage() {
    this.loading = true;
    if (!prompt) {
      alert('Please enter a prompt!');
      this.loading = false;
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
                  this.loading = false;
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
                      this.loading = false;
                      if (
                        suprised.includes('yes') ||
                        suprised.includes('Yes')
                      ) {
                        this.source = '../../assets/My project-4.jpg';
                        this.loading = false;
                      } else {
                        this.source = '../../assets/My project-2.jpg';
                        this.loading = false;
                      }
                    });
                }
              });
          } else {
            this.source = '../../assets/My project-1.jpg';
            this.loading = false;
          }
        });
    }
  }

  ngOnInit(): void {}
}
