
import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs { }
