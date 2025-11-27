import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Users } from '../../services/users';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../models/user';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm!: FormGroup;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usersService: Users,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  irRegistro() {
    this.router.navigate(['/registro-usuario']);
  }

  login() {
    if (this.loginForm.invalid) {
      this.snack.open("Completa todos los campos", "Cerrar", {
        duration: 2000
      });
      return;
    }

    const usuario: User = {
      id: 0,
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
      rol: ''
    };

    this.usersService.login(usuario).subscribe({
      next: () => {
        this.snack.open("Inicio de sesión exitoso", "OK", {
          duration: 2000
        });
        this.router.navigate(['/oferta-inmueble']);
      },
      error: () => {
        this.snack.open("Usuario o contraseña incorrectos", "Cerrar", {
          duration: 2000
        });
      }
    });
  }
}