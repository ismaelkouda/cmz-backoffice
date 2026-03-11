// import { CommonModule } from '@angular/common';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     input,
//     output,
// } from '@angular/core';
// import { ControlValueAccessor } from '@angular/forms';

// import {
//     DEFAULT_IMAGE_UPLOAD_CONFIG,
//     ImageUploadConfig,
// } from './domain/types/image-upload.types';

// @Component({
//     selector: 'app-image-upload',
//     templateUrl: './image-upload.component.html',
//     styleUrls: ['./image-upload.component.scss'],
//     imports: [CommonModule],
//     changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ImageUploadComponent implements ControlValueAccessor {
//     readonly config = input<ImageUploadConfig>(DEFAULT_IMAGE_UPLOAD_CONFIG);
//     readonly imageSelected = output<File | null>();
//     previewUrl: string | null = null;
//     private value: File | null = null;

//     disabled = false;

//     onChange: any = () => {
//         /* empty */
//     };
//     onTouched: any = () => {
//         /* empty */
//     };

//     onFileSelected(event: Event): void {
//         console.log('event: ', event);
//         const input = event.target as HTMLInputElement;
//         if (!input.files?.length) {
//             return;
//         }

//         const file = input.files[0];
//         this.value = file;

//         if (this.config().enablePreview) {
//             const reader = new FileReader();
//             reader.onload = () => (this.previewUrl = reader.result as string);
//             reader.readAsDataURL(file);
//         }

//         this.onChange(file);
//         this.imageSelected.emit(event);
//     }

//     writeValue(value: File | null): void {
//         this.value = value;
//         if (value) {
//             this.previewUrl = URL.createObjectURL(value);
//         } else {
//             this.previewUrl = null;
//         }
//     }

//     registerOnChange(fn: any): void {
//         this.onChange = fn;
//     }

//     registerOnTouched(fn: any): void {
//         this.onTouched = fn;
//     }

//     setDisabledState(isDisabled: boolean): void {
//         this.disabled = isDisabled;
//     }
// }
