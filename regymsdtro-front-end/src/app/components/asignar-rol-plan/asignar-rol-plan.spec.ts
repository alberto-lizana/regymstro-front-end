import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignarRolPlan } from './asignar-rol-plan';

describe('AsignarRolPlan', () => {
  let component: AsignarRolPlan;
  let fixture: ComponentFixture<AsignarRolPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarRolPlan],
    }).compileComponents();

    fixture = TestBed.createComponent(AsignarRolPlan);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
