import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');

    if (token) {
        // Wenn wir einen Token haben, klonen wir die Anfrage und fügen den Header hinzu
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Token ${token}`,
            },
        });
        return next(cloned);
    }

    // Wenn kein Token da ist, Anfrage normal weiterschicken (z.B. beim Login-Versuch selbst)
    return next(req);
};
