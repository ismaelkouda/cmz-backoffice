/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProvisionningService } from './provisionning.service';

describe('Service: Provisionning', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProvisionningService]
    });
  });

  it('should ...', inject([ProvisionningService], (service: ProvisionningService) => {
    expect(service).toBeTruthy();
  }));
});
