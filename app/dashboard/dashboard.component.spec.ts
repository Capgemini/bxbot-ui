import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Http} from '@angular/http';
import {async, inject, ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardComponent} from './dashboard.component';
import {DashboardModule} from './dashboard.module';
import {addMatchers, click} from '../../testing';
import {FakeExchangeDataPromiseService} from '../model/exchange/testing';
import {ExchangeHttpDataPromiseService} from '../model/exchange';

/**
 * Learning ground for writing jasmine tests.
 * Code originated from here: https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
class RouterStub {
    navigateByUrl(url: string) {
        return url;
    }
}

beforeEach(addMatchers);

let comp: DashboardComponent;
let fixture: ComponentFixture<DashboardComponent>;

/**
 * Test accessing the Dashboard item div - deep
 */
describe('DashboardComponent tests with TestBed (deep)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DashboardModule]
        });
    });

    compileAndCreate();
    tests(clickForDeep);

    function clickForDeep() {
        // get first <div class='item'> DebugElement
        const dashboardItem = fixture.debugElement.query(By.css('.item'));
        click(dashboardItem);
    }
});

/**
 * Test accessing Dashboard item using bx-dashboard-item directive.
 */
describe('DashboardComponent tests with TestBed (shallow)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    compileAndCreate();
    tests(clickForShallow);

    function clickForShallow() {
        // get first <bx-dashboard-item> DebugElement
        const dashboardItemElement = fixture.debugElement.query(By.css('bx-dashboard-item'));
        dashboardItemElement.triggerEventHandler('selected', comp.exchanges[0]);
    }
});

/**
 * Add TestBed providers, compile, and create DashboardComponent.
 */
function compileAndCreate() {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: ExchangeHttpDataPromiseService, useClass: FakeExchangeDataPromiseService},
                {provide: Router, useClass: RouterStub},
                {provide: Http, useValue: {}} // need this because the FakeExchangeDataPromiseService extends ExchangeHttpDataPromiseService
            ]
        })
            .compileComponents().then(() => {
            fixture = TestBed.createComponent(DashboardComponent);
            comp = fixture.componentInstance;
        });
    }));
}

/**
 * The (almost) same tests for both.
 * Only change: the way that the first Exchange is clicked.
 */
function tests(exchangeClick: Function) {

    it('should not have Exchange items before ngOnInit', () => {
        expect(comp.exchanges.length).toBe(0, 'should not have Exchange items before ngOnInit');
    });

    it('should not have Exchange items immediately after ngOnInit', () => {
        fixture.detectChanges(); // runs initial lifecycle hooks
        expect(comp.exchanges.length).toBe(0,
            'should not have Exchange items until ExchangeAdapterDataService promise resolves');
    });

    describe('After ExchangeAdapterDataService promise resolves', () => {

        // Trigger component so it gets exchanges and binds to them
        beforeEach(async(() => {
            fixture.detectChanges(); // runs ngOnInit -> getExchangesUsingPromise
            fixture.whenStable() // No need for the `lastPromise` hack!
                .then(() => fixture.detectChanges()); // bind to exchanges
        }));

        it('should have Exchange items', () => {
            expect(comp.exchanges.length).toBeGreaterThan(0,
                'should have Exchange items');
        });

        it('should display 3 Exchange items', () => {
            // Find and examine the displayed exchanges
            // Look for them in the DOM by css class
            const exchanges = fixture.debugElement.queryAll(By.css('bx-dashboard-item'));
            expect(exchanges.length).toBe(3, 'should display 3 Exchange items');
        });

        it('should tell Router to navigate when Exchange item selected',
            inject([Router], (router: Router) => {

                const spy = spyOn(router, 'navigateByUrl');
                exchangeClick(); // trigger click on first inner <div class='item'>

                // args passed to router.navigateByUrl()
                const navArgs = spy.calls.first().args[0];

                // expecting to navigate to id of the component's first Exchange
                const id = comp.exchanges[0].id;
                expect(navArgs).toBe('/exchange/' + id,
                    'should nav to ExchangeDetailsComponent for first Exchange');
        }));
    });
}
