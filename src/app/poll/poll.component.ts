import { Component, OnInit } from '@angular/core';
import { Poll } from '../poll.models';
import { PollService } from '../poll.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css'
})
export class PollComponent implements OnInit{
  newPoll: Omit<Poll, 'id'> = {
    question: '',
    options: [
      { optionText:'',votesCount:0 },
      { optionText:'',votesCount:0 }
    ]
  }
  polls: Poll[] = [];

  constructor(private pollService: PollService){

  }

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(){
    this.pollService.getPolls().subscribe({
      next: (data) =>{
        this.polls=data;
      },
      error: (error) =>{
        console.error("Error fetching polls: ", error);
      }
    });
  }

  addOption(){
    this.newPoll.options.push({ optionText: '', votesCount: 0 })
  };

  createPoll(){
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (createdPoll)=>{
        this.polls.push(createdPoll);
        this.resetPoll();
      },
      error: (error)=>{
        console.error("Error creating Polls: ",error);
      }
    });
  }

  resetPoll(){
    this.newPoll = {
      question: '',
      options: [
        { optionText:'',votesCount:0 },
        { optionText:'',votesCount:0 }
      ]
    }
  }

  vote(pollId: number, optionIndex: number){
    this.pollService.vote(pollId,optionIndex).subscribe({
      next: () =>{
        const poll=this.polls.find(p=>p.id===pollId);
        if(poll){
          poll.options[optionIndex].votesCount++;
        }
      },
      error: (error)=>{
        console.error("Error fetching votes on a Poll: ",error);
      }
    })
  }

  trackByIndex(index: number): number{
    return index;
  }
}
