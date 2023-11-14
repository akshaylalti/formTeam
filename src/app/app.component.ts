import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { User } from './data.model';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  totalRecords: number = 0;
  first: number = 0;
  rows: number = 20;
  users!: User[];
  tempData!: User[];
  genderList:string[]=[];
  domainList:string[]=[];
  teamMembers: User[] = []; // Added for storing team members
  constructor(private service: DataService) {}
  ngOnInit(): void {
    this.service.getData().subscribe((response) => {
      this.users = response;
      this.tempData = response;
      this.totalRecords = response.length;
      this.getGenderList(response);
      // this.getDomainList(response);
    });
  }

  getGenderList(val: User[]){
    this.genderList = Array.from(new Set(val.map(obj => obj.gender)));
    this.genderList.unshift('All');
  }

  // getDomainList(val: User[]){
  //   this.domainList = Array.from(new Set(val.map(obj => obj.domain)));
  //   this.domainList.unshift('All');
  // }
  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
  }

  clear() {
    this.users = this.tempData;
    this.teamMembers = []; // Clear team members when clearing filters
  }
  searchData(text: any) {
    if (!text) {
      this.users = this.users;
    }

    this.users = this.users.filter((housingLocation) =>
      housingLocation?.first_name.toLowerCase().includes(text.toLowerCase())
    );

    this.updateTeamMembers(); // Update team members after search
  }

  changeGenderValue(val: any) {
    if (val.value == 'All') {
      this.users = this.tempData;
    } else {
      this.users = this.tempData.filter((x) => x.gender === val.value);
    }
    this.updateTeamMembers(); // Update team members after changing gender filter
  }

  // changeDomainValue(val: any) {
  //   if (val.value == 'All') {
  //     this.users = this.tempData;
  //   } else {
  //     this.users = this.tempData.filter((x) => x.domain === val.value);
  //   }
  //   this.updateTeamMembers(); // Update team members after changing domain filter
  // }
  addToTeam(user: User) {
    // Check if the user is not already in the team
    if (!this.teamMembers.some((member) => member.id === user.id)) {
      this.teamMembers.push(user);
    }
  }

  updateTeamMembers() {
    // Filter team members based on the current users list
    this.teamMembers = this.teamMembers.filter((member) =>
      this.users.some((user) => user.id === member.id)
    );
  }
}
