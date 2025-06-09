import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cloudinaryOpt',
  standalone: true,
})
export class CloudinaryOptPipe implements PipeTransform {
  transform(
    url: string,
    width: number = 200,
    height: number = 200,
    crop: string = 'fill',
    quality: string = 'auto'
  ): string {
    if (!url || !url.includes('/upload/')) return url;
    const transformation = `w_${width},h_${height},c_${crop},q_${quality}`;
    return url.replace('/upload/', `/upload/${transformation}/`);
  }
}
