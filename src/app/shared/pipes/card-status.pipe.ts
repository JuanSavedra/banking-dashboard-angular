import { Pipe, PipeTransform } from '@angular/core';

import { CardStatus } from '../../core/models/banking';
import { CARD_STATUS, StatusPresentation } from '../status/status-presentation';

@Pipe({ name: 'cardStatus', standalone: true })
export class CardStatusPipe implements PipeTransform {
  transform(status: CardStatus): StatusPresentation {
    return CARD_STATUS[status];
  }
}
