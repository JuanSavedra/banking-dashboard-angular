import { Pipe, PipeTransform } from '@angular/core';

import { BeneficiaryStatus } from '../../core/models/banking';
import { BENEFICIARY_STATUS, StatusPresentation } from '../status/status-presentation';

@Pipe({ name: 'beneficiaryStatus', standalone: true })
export class BeneficiaryStatusPipe implements PipeTransform {
  transform(status: BeneficiaryStatus): StatusPresentation {
    return BENEFICIARY_STATUS[status];
  }
}
