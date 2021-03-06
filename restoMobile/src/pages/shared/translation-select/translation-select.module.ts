import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationSelectComponent } from './translation-select.component';
import {TranslateModule} from 'ng2-translate';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule, TranslateModule, FormsModule],
    declarations: [TranslationSelectComponent],
    exports: [TranslationSelectComponent]
})

export class TranslationSelectModule { }
