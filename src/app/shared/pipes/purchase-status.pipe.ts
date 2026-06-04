import { Pipe, PipeTransform } from '@angular/core';

import { CardPurchaseStatus } from '../../core/models/banking';
import { PURCHASE_STATUS, StatusPresentation } from '../status/status-presentation';

@Pipe({ name: 'purchaseStatus', standalone: true })
export class PurchaseStatusPipe implements PipeTransform {
  transform(status: CardPurchaseStatus): StatusPresentation {
    return PURCHASE_STATUS[status];
  }
}
