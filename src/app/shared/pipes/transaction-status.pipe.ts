import { Pipe, PipeTransform } from '@angular/core';

import { TransactionStatus } from '../../core/models/banking';
import { StatusPresentation, TRANSACTION_STATUS } from '../status/status-presentation';

@Pipe({ name: 'transactionStatus', standalone: true })
export class TransactionStatusPipe implements PipeTransform {
  transform(status: TransactionStatus): StatusPresentation {
    return TRANSACTION_STATUS[status];
  }
}
