import { HttpClient } from "@angular/common/http";
import {Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({providedIn: "root"})
export class LoginFormService{
    private apiServerUrl = 'http://localhost:8080'

    constructor( private http: HttpClient ) {

    }

    
}