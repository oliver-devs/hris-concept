import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

// WICHTIG: Den Service importieren, nicht nur das Interface
import { EmployeeService } from './employee';

describe('EmployeeService', () => {
    let service: EmployeeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                // Damit inject(HttpClient) im Service funktioniert:
                provideHttpClient(),
                provideHttpClientTesting(),
                // Den Service selbst bereitstellen (falls nicht providedIn: root)
                EmployeeService,
            ],
        });
        // Hier injecten wir die Klasse EmployeeService
        service = TestBed.inject(EmployeeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
