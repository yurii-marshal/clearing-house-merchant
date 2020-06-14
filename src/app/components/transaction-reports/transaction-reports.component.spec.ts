import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TransactionReportsComponent} from "./transaction-reports.component";

describe('TransactionReportsComponent', () => {
  let component: TransactionReportsComponent;
  let fixture: ComponentFixture<TransactionReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
