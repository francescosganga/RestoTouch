import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ProfileService} from './profile.service';
import {User} from '../../shared/models/user';

@Component({
  moduleId: module.id,
  selector: 'profile-cmp',
  templateUrl: 'profile.component.html',
  providers: [ProfileService]
})

export class ProfileComponent {
	user = new User('', '');
	editing: boolean = false;
	editPass: boolean = false;
	hideMessageSuccess: boolean = true;
	passwordAlert: boolean = false;
	errorMessage: string;

	constructor(private profileService: ProfileService,
				private router: Router) {
		this.profileService.getProfile().subscribe(user => {
			this.user = user;
			console.log(user);
		});
	}

	edit() {
		this.editing = !this.editing;
		this.hideMessageSuccess = true;
	}

	editPassword() {
		this.editPass = !this.editPass;
	}

	save() {
		if(this.editPass && (this.user.password !== this.user.passwordConfirm)) {
			this.passwordAlert = true;
			this.errorMessage = "Passwords don't match.";
		}
		else {
			this.passwordAlert = false;
			this.profileService.saveProfile(this.user).subscribe(
      		generalResponse => {
        		this.router.navigate(['/dashboard/profile']);
	      	});
	      	this.editing = false;
	      	this.editPass = false;
	      	this.hideMessageSuccess = false;
		}
	}

	cancel() {
		this.editing = false;
		this.editPass = false;
		this.hideMessageSuccess = true;
		this.passwordAlert = false;
		//Could maybe be improved.
		this.profileService.getProfile().subscribe(user => {
			this.user = user;
			console.log(user);
		});
	}
}
