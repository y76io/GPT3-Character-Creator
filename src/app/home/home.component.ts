import { style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as $ from 'jquery';
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
  characters: any = [];
  race = ['White', 'Black', 'Indian', 'Asian'];
  s_race = 'Random';
  loading = false;

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
          await this.generateCharacterImage(
            0,
            true,
            this.stories[0],
            '',
            ''
          ).then(async () => {
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

  async generate20Images(index: any, random = true) {
    this.loading = true;
    let stry: any = $('.storySelector')[index];
    let stry_text = $(stry).val();

    // this.spinner.show();
    var newArray = this.charactersImages.filter(function (el: any) {
      return el.character != index;
    });
    this.charactersImages = newArray;

    let gender;
    let age;
    let race;
    var prompt =
      'This character is a female soldier named Sarah Anderson. She was born and raised in London, England during the Victorian era. She was the eldest of four children born to a middle-class family. Sarah was expected to help support her family, so she took a job as a seamstress at the age of sixteen.\n' +
      'At the same time, Sarah had ambitions to become a soldier. She was inspired by the courage of the soldiers fighting in the Crimean War, and by the stories of the female soldiers who had served as nurses during the war. Sarah was determined to enlist.\n' +
      'In 1859, Sarah joined the British Army and was assigned to the 1st Battalion of the Grenadiers. She quickly distinguished herself as a brave and capable soldier, and was soon promoted to the rank of corporal.\n' +
      'Sarah served with distinction during the Second Boer War in South Africa, where she received several honors for bravery. She was also one of the few female soldiers to serve in the trenches during the First World War.\n' +
      "Sarah's service in the military provided her with invaluable life experiences. She was a fiercely independent woman who was respected and admired by her fellow soldiers. After the war, Sarah returned to England and settled in a small town where she married\n" +
      'what is the gender of this character?\n' +
      'female\n' +
      stry_text +
      '\n' +
      'what is the gender of this character?\n';
    let genderVal: any = $('.genderSelector:eq(' + index + ')');

    await axios
      .post(
        'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
        {
          prompt: prompt,
        }
      )
      .then(async (response) => {
        gender = await response.data.response.comp;
        if (gender.includes('female') || gender.includes('Female')) {
          gender = 'Female';
        } else {
          gender = 'Male';
        }
        if (random) {
          $(genderVal).val(gender).change();
        }
      })
      .catch(function (error) {
        console.log(error);
        alert('Something went wrong !');
      });

    prompt =
      "This character is a female soldier who is 29 years of age. Her name is Catherine and she is from a small town in France. She enlisted in the French Army at the age of 18, eager to make a difference in the world. She was a talented soldier and quickly rose through the ranks, becoming a Lieutenant by the age of 24.\nDuring her time in the Army, Catherine was deployed on multiple missions in the Middle East, Africa, and Asia. She saw combat in many of these locations and was decorated for her bravery and courage in the face of danger.\nCatherine's career was cut short when she was critically injured in an ambush in Syria. She was medically discharged from duty and returned home to France where she could recover.\nAlthough she was no longer able to serve in the military, Catherine was determined to continue to make a difference. She became an advocate for veterans, helping to secure better benefits for them and working to ensure their voices were heard. She also worked to improve the lives of those who were still serving, ensuring that their needs were met and their rights were protected.\r\n\r\nCatherine was a passionate and determined soldier and her legacy will live on. She is a reminder of the courage and sacrifice that all soldiers.\nwhat is the age of this character?\n29\n" +
      stry_text +
      '\n' +
      'what is the age of this character?\n';
    let ageVal: any = $('.ageSelector:eq(' + index + ')');

    await axios
      .post(
        'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
        {
          prompt: prompt,
        }
      )
      .then(async (response) => {
        age = await response.data.response.comp;
        try {
          age = Number(age);
          if (age >= 0 && age <= 2) {
            age = '0-2';
          } else if (age >= 3 && age <= 9) {
            age = '3-9';
          } else if (age >= 10 && age <= 19) {
            age = '10-19';
          } else if (age >= 20 && age <= 29) {
            age = '20-29';
          } else if (age >= 30 && age <= 39) {
            age = '30-39';
          } else if (age >= 40 && age <= 49) {
            age = '40-49';
          } else if (age >= 50 && age <= 59) {
            age = '50-59';
          } else if (age >= 60 && age <= 69) {
            age = '60-69';
          } else if (age >= 70) {
            age = '70+';
          } else {
            age = 'Random';
          }
          if (random) {
            $(ageVal).val(age).change();
          }
        } catch (error) {
          age = 'Random';
        }
      })
      .catch(function (error) {
        console.log(error);
        alert('Something went wrong !');
      });

    prompt =
      'This is the story of Isaiah, a soldier in the United States Army. Isaiah was born in 1930 in a small town in the southern United States. His parents, both African American, had moved there to escape the oppressive racial segregation laws in their home state of Mississippi. Isaiah was raised with a strong sense of justice and a desire to do what was right.\r\nIsaiah was a bright student, and he excelled in his studies. His teachers encouraged him to pursue a career in the military, which he did. He joined the Army in 1948 and quickly rose through the ranks. Isaiah was eventually assigned to the 82nd Airborne Division, where he served as a paratrooper.\r\nDuring the Korean War, Isaiah was deployed to the Korean Peninsula. He fought bravely and honorably, and he was eventually promoted to the rank of sergeant. He was respected by his fellow soldiers, and by the end of the war, he had earned two Bronze Stars for his valiant service.\r\nAfter the war, Isaiah continued to serve in the Army, eventually retiring with the rank of Colonel. He settled down and married a woman from his hometown, with whom he had two children. Isaiah remained passionate about his country and devoted much of his life to public service\r\nwhat is the race of this character?\r\nBlack\r\nwhat is the race of this character?\r\nBlack\r\nwhat is the race of this character?\r\nBlack\r\nThis is the story of Jin, a soldier in the United States Army. Jin was born in 1940 in a small town in the northern part of China. His parents, both Chinese, had moved there to escape the civil unrest in their home province. Jin was raised with a strong sense of patriotism and a desire to serve his country.\r\nJin was a bright student, and he excelled in his studies. His teachers encouraged him to pursue a career in the military, which he did. He joined the Army in 1957 and quickly rose through the ranks. Jin was eventually assigned to the 101st Airborne Division, where he served as a paratrooper.\r\nDuring the Vietnam War, Jin was deployed to the Southeast Asian country. He fought bravely and honorably, and he was eventually promoted to the rank of lieutenant. He was respected by his fellow soldiers, and by the end of the war, he had earned two Bronze Stars for his valiant service.\r\nAfter the war, Jin continued to serve in the Army, eventually retiring with the rank of Major. He settled down and married a woman from his hometown, with whom he had two children. Jin remained passionate about his country and devoted much of his life to public service.\r\nwhat is the race of this character?\r\nAsian\r\nThis is the story of Rajesh, a soldier in the Indian Army. Rajesh was born in 1945 in a small village in the western Indian state of Gujarat. His parents, both Indian, had moved there to escape the caste system in their home state. Rajesh was raised with a strong sense of justice and a desire to do what was right.\r\nRajesh was a bright student, and he excelled in his studies. His teachers encouraged him to pursue a career in the military, which he did. He joined the Army in 1963 and quickly rose through the ranks. Rajesh was eventually assigned to the Infantry Division, where he served as a sharpshooter.\r\nDuring the Bangladesh War of Liberation, Rajesh was deployed to the country. He fought bravely and honorably, and he was eventually promoted to the rank of captain. He was respected by his fellow soldiers, and by the end of the war, he had earned two medals of bravery for his valiant service.\r\nAfter the war, Rajesh continued to serve in the Army, eventually retiring with the rank of Major. He settled down and married a woman from his hometown, with whom he had two children. Rajesh remained passionate about his country and devoted much of his\r\nwhat is the race of this character?\r\nIndian' +
      '\n' +
      stry_text +
      '\n' +
      'what is the race of this character?\n';
    let raceVal: any = $('.raceSelector:eq(' + index + ')');

    await axios
      .post(
        'https://us-central1-hookline-magic-f926f.cloudfunctions.net/openAiSandbox',
        {
          prompt: prompt,
        }
      )
      .then(async (response) => {
        race = await response.data.response.comp;
        if (race.includes('Black') || race.includes('black')) {
          race = 'Black';
        } else if (race.includes('White') || race.includes('white')) {
          race = 'White';
        } else if (race.includes('Asian') || race.includes('asian')) {
          race = 'Asian';
        } else if (race.includes('Indian') || race.includes('indian')) {
          race = 'Indian';
        } else {
          race = 'Random';
        }
        if (random) {
          $(raceVal).val(race).change();
        }
      })
      .catch(function (error) {
        console.log(error);
        alert('Something went wrong !');
      });
    this.characters[index].gender = this.characters[index].gender
      ? this.characters[index].gender
      : gender;
    this.characters[index].age = this.characters[index].age
      ? this.characters[index].age
      : age;
    this.characters[index].race = this.characters[index].race
      ? this.characters[index].race
      : race;
    for (let i = 0; i < 20; i++) {
      this.generateCharacterImage(index, random, gender, age, race);
    }
    // this.spinner.hide();
  }
  imageLoad() {
    this.loading = false;
  }

  async generateCharacterImage(
    index: any,
    random: any,
    gender: any,
    age: any,
    race: any
  ) {
    // this.spinner.show();

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

    let selected_model = model[Math.floor(Math.random() * model.length)];
    // let selected_gender =
    //   gender_list[Math.floor(Math.random() * gender_list.length)];

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found');
    } else {
      let data: any;
      if (random) {
        data = {
          token,
          seed: Math.floor(Math.random() * 10000).toString(),
          model: selected_model,
          gender: gender,
          race: race,
          age: age,
        };
      } else {
        let genderVal: any = $('.genderSelector:eq(' + index + ')').val();
        let ageVal: any = $('.ageSelector:eq(' + index + ')').val();
        let raceVal: any = $('.raceSelector:eq(' + index + ')').val();

        data = {
          token,
          seed: Math.floor(Math.random() * 10000).toString(),
          model: selected_model,
          gender: genderVal,
          race: raceVal,
          age: ageVal,
        };
      }

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
              age: age,
              gender: gender,
            });

            // this.spinner.hide();
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

  changeStory(event: any, i: any) {
    this.loading = true;

    let wordSearch = event.target.value;
    setTimeout(() => {
      if (wordSearch == event.target.value) {
        if (event.target.value) {
          this.generate20Images(i);
        }
      }
    }, 3000);
  }
  trackByFn(index: any, item: any) {
    return index;
  }

  onItemChange($event: any): void {
    console.log('Carousel onItemChange', $event);
  }

  filterByCharacter(index: any) {
    return this.charactersImages.find((t: any) => t.character === index);
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

      // const prompt =
      //   "generate a conversation with ahmad wehbe.Ahmad Wehbe was born in Baghdad, Iraq in 1978. His father was a soldier in the Iraqi Army and was killed in the Iran-Iraq War when Ahmad was just four years old. Ahmad's mother died of cancer when he was ten. He was raised by his aunt and uncle who were very strict with him. Ahmad joined the Iraqi Army when he was eighteen and served for six years before being deployed to Afghanistan as part of the International Security Assistance Force (ISAF). He served two tours in Afghanistan before being wounded in an IED explosion. Ahmad returned to Iraq after his recovery and is currently serving as a soldier in the Iraqi Army. ";
      let prompt;
      for (var i = 0; i < this.numberOfStories; i++) {
        let selected_race =
          this.race[Math.floor(Math.random() * this.race.length)];

        prompt =
          'create a random gender ' +
          selected_race +
          ' race character with random age which is a ' +
          this.brief +
          '.give me big backstory and the historical background of this character and describe all the details of his story:';
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
            this.characters.push({ story: x });
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

  filterFunction(characters: any, i: any): any[] {
    return characters.filter((character: any) => character.character === i);
  }

  ngOnInit(): void {
    this.generateToken();
  }
}
