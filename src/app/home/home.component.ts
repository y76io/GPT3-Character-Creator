import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  name: string = '';
  brief: string = '';
  stories: any = [];
  numberOfStories: number = 1;
  selectedStory: any = null;
  conversation: any = '';
  image = '';
  token = '';
  gender = 'Male';
  characterInfo: any = {};
  age = '20-29';
  charactersImages: any = [];
  filterargs = { character: 0 };

  constructor(private spinner: NgxSpinnerService) {}

  selectStory(i: any) {
    this.selectedStory = i;
  }

  async generateToken() {
    let data: any = {
      secret_key:
        '34753778214125432A462D4A614E645267556B58703273357638792F423F4528',
    };
    data = JSON.stringify(data);

    var config = {
      method: 'get',
      url: 'http://35.208.4.23:5000/subscription?data=' + data,
    };

    await axios(config)
      .then(async (response) => {
        if (response.data && response.status === 200) {
          localStorage.setItem('token', response.data.body.token);
        } else {
          alert('Something went wrong !');
        }
      })
      .catch(function (error) {
        console.log(error);
        alert('Something went wrong !');
      });
  }

  async generateCharName() {
    if (!this.brief) {
      alert('Please enter character brief !');
      return;
    } else if (!this.numberOfStories || this.numberOfStories < 1) {
      alert('Number of stories should be at least 1');
      return;
    } else {
      this.spinner.show();

      const prompt =
        'The character is a ' +
        this.brief +
        '.\n' +
        'Provide a ' +
        this.gender.toLowerCase() +
        ' name for this character.';
      // const prompt =
      //   "generate a conversation with ahmad wehbe.Ahmad Wehbe was born in Baghdad, Iraq in 1978. His father was a soldier in the Iraqi Army and was killed in the Iran-Iraq War when Ahmad was just four years old. Ahmad's mother died of cancer when he was ten. He was raised by his aunt and uncle who were very strict with him. Ahmad joined the Iraqi Army when he was eighteen and served for six years before being deployed to Afghanistan as part of the International Security Assistance Force (ISAF). He served two tours in Afghanistan before being wounded in an IED explosion. Ahmad returned to Iraq after his recovery and is currently serving as a soldier in the Iraqi Army. ";

      await axios
        .post(
          'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
          {
            prompt: prompt,
          }
        )
        .then(async (response) => {
          this.name = await response.data.response.comp;
          await this.generateCharacterImage(0).then(async () => {
            await this.generateChar().then(async () => {
              this.spinner.hide();
            });
          });
        })
        .catch(function (error) {
          console.log(error);
          alert('Something went wrong !');
        });
    }
  }
  async generateConversation() {
    if (!this.name) {
      alert('Please print a name !');
    } else if (!this.selectStory) {
      alert('Please select a story above !');
      return;
    } else {
      this.spinner.show();

      const prompt =
        this.stories[this.selectedStory].trim() +
        '\n' +
        'Generate a long conversation between me and ' +
        this.name +
        ' about his backstory.';
      // const prompt =
      //   "generate a conversation with ahmad wehbe.Ahmad Wehbe was born in Baghdad, Iraq in 1978. His father was a soldier in the Iraqi Army and was killed in the Iran-Iraq War when Ahmad was just four years old. Ahmad's mother died of cancer when he was ten. He was raised by his aunt and uncle who were very strict with him. Ahmad joined the Iraqi Army when he was eighteen and served for six years before being deployed to Afghanistan as part of the International Security Assistance Force (ISAF). He served two tours in Afghanistan before being wounded in an IED explosion. Ahmad returned to Iraq after his recovery and is currently serving as a soldier in the Iraqi Army. ";

      await axios
        .post(
          'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
          {
            prompt: prompt,
          }
        )
        .then((response) => {
          this.conversation = response.data.response.comp.split('\n\n');
        })
        .catch(function (error) {
          console.log(error);
          alert('Something went wrong !');
        });

      this.selectedStory = 0;
      this.spinner.hide();
    }
  }

  generate20Images(index: any) {
    var newArray = this.charactersImages.filter(function (el: any) {
      return el.character != index;
    });
    this.charactersImages = newArray;
    for (let i = 0; i < 20; i++) {
      this.generateCharacterImage(index);
    }
  }

  async generateCharacterImage(index: any) {
    this.spinner.show();

    const model = [
      'Random',
      'human',
      'cartoon_style_1',
      'cartoon_style_2',
      'cartoon_style_3',
      'cartoon_style_4',
      'cartoon_style_5',
      'cartoon_style_6',
      'cartoon_style_7',
    ];

    let gender_list = ['Male', 'Female'];
    let selected_model = model[Math.floor(Math.random() * model.length)];
    let selected_gender =
      gender_list[Math.floor(Math.random() * gender_list.length)];

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found');
    } else {
      let data: any = {
        token,
        seed: Math.floor(Math.random() * 10000).toString(),
        model: selected_model,
        gender: selected_gender,
        race: 'Random',
        age: 'Random',
      };
      data = JSON.stringify(data);
      var config = {
        method: 'get',
        url: 'http://35.208.4.23:5000/generate_image?data=' + data,
      };
      console.log(data);
      await axios(config)
        .then(async (response) => {
          if (
            response.data &&
            response.status === 200 &&
            response.data.status_code === 200
          ) {
            this.charactersImages.push({
              character: index,
              image:
                'http://35.208.4.23:5000' +
                (await response.data.body.generated_image),
            });

            console.log(this.charactersImages);
            this.spinner.hide();
          } else {
            console.log('error');
          }
        })
        .catch(function (error) {
          console.log(error);
          alert('Something went wrong !');
        });
    }
  }

  async generateChar() {
    if (!this.brief) {
      alert('Please enter character brief !');
      return;
    } else if (!this.numberOfStories || this.numberOfStories < 1) {
      alert('Number of stories should be at least 1');
      return;
    } else {
      this.spinner.show();
      this.stories = [];
      const prompt =
        'Give me big backstory and the historical background of a character who is a ' +
        this.brief +
        '. Describe all the details of his story';

      // const prompt =
      //   "generate a conversation with ahmad wehbe.Ahmad Wehbe was born in Baghdad, Iraq in 1978. His father was a soldier in the Iraqi Army and was killed in the Iran-Iraq War when Ahmad was just four years old. Ahmad's mother died of cancer when he was ten. He was raised by his aunt and uncle who were very strict with him. Ahmad joined the Iraqi Army when he was eighteen and served for six years before being deployed to Afghanistan as part of the International Security Assistance Force (ISAF). He served two tours in Afghanistan before being wounded in an IED explosion. Ahmad returned to Iraq after his recovery and is currently serving as a soldier in the Iraqi Army. ";

      for (var i = 0; i < this.numberOfStories; i++) {
        await axios
          .post(
            'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
            {
              prompt: prompt,
            }
          )
          .then(async (response) => {
            let x = await response.data.response.comp;
            this.stories.push(x);
          })
          .catch(function (error) {
            console.log(error);
            alert('Something went wrong !');
          });
      }
      this.selectedStory = 0;
      this.spinner.hide();
    }
  }

  ngOnInit(): void {
    this.generateToken();
  }
}
