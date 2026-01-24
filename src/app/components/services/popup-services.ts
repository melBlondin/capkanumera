import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { eventocalisationGroup } from '../../core/interfaces/popup-interface';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private eventLocalisation: eventocalisationGroup = {
    Xposition: 0,
    Yposition: 0,
    cityName: 'Leucate',
    status: false,
  };

  // Creation of a group including language et flag to get only one observable and then on subscription from components
  private eventSubject = new BehaviorSubject<eventocalisationGroup>(this.eventLocalisation);
  public eventLocalisation$ = this.eventSubject.asObservable();

  /**To update the Observable value
   *
   * @param language  Selected languageand corresponding flag group
   */
  public updateSelectedCity(event: eventocalisationGroup): void {
    const currentEvent = this.eventSubject.getValue();
    this.eventSubject.next({ ...currentEvent, ...this.eventLocalisation });
  }
}
