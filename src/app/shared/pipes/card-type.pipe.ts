import { Pipe, PipeTransform } from '@angular/core';

import { CardType } from '../../core/models/banking';
import { CARD_TYPE_LABEL } from '../status/status-presentation';

@Pipe({ name: 'cardType', standalone: true })
export class CardTypePipe implements PipeTransform {
  transform(type: CardType): string {
    return CARD_TYPE_LABEL[type];
  }
}
