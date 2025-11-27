import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../models/client';
import { Users } from '../../services/users';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-detalle-cliente',
  imports: [ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink, NgClass, CommonModule],
  templateUrl: './detalle-cliente.html',
  styleUrl: './detalle-cliente.css',
})
export class DetalleCliente {
  form!: FormGroup;
  mostrarPass: boolean = false;
  stepsCompletos = { step1: false, step2: false, step3: false, step4: false };
  modoPerfil: boolean = false;


  constructor(
    private fb: FormBuilder,
    private userService: Users,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthday: ['', [Validators.required, this.validarMayorDeEdad]],
      maritalStatus: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      gender: ['', Validators.required],
      dni: ['', Validators.required],
      ruc: ['', Validators.required],
      currencyType: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.min(0)]]
    });

    this.form.valueChanges.subscribe(() => {
      this.validarSteps();
    });

    const id = this.userService.getUserIdActual();
    if (id) {
      this.cargarDatosUsuario(Number(id));
    }
  }

  registrar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackbar.open('Todos los campos son obligatorios', 'OK', { duration: 3000 });
      return;
    }

    const client: Client = {
      id: 0,
      name: this.form.get('name')?.value,
      lastName: this.form.get('lastName')?.value,
      address: this.form.get('address')?.value,
      username: this.form.get('username')?.value,
      password: this.form.get('password')?.value,
      email: this.form.get('email')?.value,
      birthday: this.form.get('birthday')?.value,
      maritalStatus: this.form.get('maritalStatus')?.value,
      phoneNumber: this.form.get('phoneNumber')?.value,
      gender: this.form.get('gender')?.value,
      dni: this.form.get('dni')?.value,
      ruc: this.form.get('ruc')?.value,
      currencyType: this.form.get('currencyType')?.value,
      monthlyIncome: this.form.get('monthlyIncome')?.value,
      enabled: true,
      roles: [{ nameRol: 'CLIENT' }]
    };

    this.userService.registrarClient(client).subscribe({
      next: () => {
        this.snackbar.open("Usuario registrado correctamente", "OK", { duration: 2000 });
        this.router.navigate(["/login"]);
      },
      error: (err) => {
        console.log(err);
        this.snackbar.open("Error al registrar usuario", "OK", { duration: 2000 });
      }
    });
  }

  cargarDatosUsuario(id: number) {
    this.userService.getUsers(id).subscribe({
      next: (user: any) => {

        if (user.currencyType) {
          localStorage.setItem("currencyType", user.currencyType);
        }

        if (user.monthlyIncome) {
          localStorage.setItem("monthlyIncome", user.monthlyIncome);
        }
        
        this.form.patchValue({
          name: user.name,
          lastName: user.lastName,
          address: user.address,
          username: user.username,
          password: user.password,
          email: user.email,
          birthday: user.birthday,
          maritalStatus: user.maritalStatus,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          dni: user.dni,
          ruc: user.ruc,
          currencyType: user.currencyType,
          monthlyIncome: user.monthlyIncome
        });

        this.form.disable();

        this.modoPerfil = true;
      },
      error: err => console.log("ERROR AL CARGAR DATOS", err)
    });
  }

  validarMayorDeEdad(control: any) {
    const fechaNacimiento = new Date(control.value);
    const hoy = new Date();

    if (isNaN(fechaNacimiento.getTime())) return null;

    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const dia = hoy.getDate() - fechaNacimiento.getDate();

    const esMenor =
      edad < 18 ||
      (edad === 18 && mes < 0) ||
      (edad === 18 && mes === 0 && dia < 0);

    return esMenor ? { menorEdad: true } : null;
  }

  soloNumeros(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      charCode === 8 ||
      charCode === 46 ||
      charCode === 9 ||
      (charCode >= 37 && charCode <= 40)
    ) {
      return;
    }

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  soloNumerosDecimales(event: KeyboardEvent) {
    const char = event.key;
    const valor: string = this.form.get('monthlyIncome')?.value || "";

    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(char)) return;

    if (char === '-') {
      event.preventDefault();
      return;
    }

    if (char === '.') {
      if (valor.includes('.')) event.preventDefault();
      return;
    }

    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }

    if (valor.includes('.')) {
      const [, decimales] = valor.split('.');
      if (decimales.length >= 2) {
        event.preventDefault();
      }
    }
  }

  limpiarValor(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/[^0-9.]/g, '');
    const partes = valor.split('.');

    if (partes.length > 2) {
      valor = partes[0] + '.' + partes[1];
    }

    if (partes[1]?.length > 2) {
      partes[1] = partes[1].substring(0, 2);
      valor = partes[0] + '.' + partes[1];
    }

    this.form.get('monthlyIncome')?.setValue(valor, { emitEvent: false });
  }

  formatearAlSalir() {
    let valor: string = this.form.get('monthlyIncome')?.value || '';

    if (!valor || valor === '.') {
      this.form.get('monthlyIncome')?.setValue('');
      return;
    }

    if (valor.endsWith('.')) {
      valor += "00";
    }

    if (valor.includes('.')) {
      const partes = valor.split('.');
      if (partes[1].length === 1) {
        valor += "0";
      }
    }

    if (!valor.includes('.')) {
      valor += ".00";
    }

    this.form.get('monthlyIncome')?.setValue(valor, { emitEvent: false });
  }

  togglePassword() {
    this.mostrarPass = !this.mostrarPass;
  }

  irLogin() {
    if (this.modoPerfil) {
      const ruta = localStorage.getItem("ruta_origen");

      if (ruta) {
        this.router.navigate([ruta]);
        return;
      }

      // Si por algún motivo no existe ruta guardada
      this.router.navigate(['/oferta-inmueble']);
      return;
    }

    // Si estaba registrando usuario nuevo
    this.router.navigate(['/login']);
  }

  validarSteps() {
    const f = this.form.controls;

    this.stepsCompletos.step1 =
      f['name'].valid &&
      f['lastName'].valid &&
      f['birthday'].valid &&
      f['maritalStatus'].valid &&
      f['dni'].valid &&
      f['ruc'].valid &&
      f['gender'].valid;

    this.stepsCompletos.step2 =
      f['address'].valid &&
      f['phoneNumber'].valid &&
      f['email'].valid;

    this.stepsCompletos.step3 =
      f['username'].valid &&
      f['password'].valid;

    this.stepsCompletos.step4 =
      f['currencyType'].valid &&
      f['monthlyIncome'].valid;
  }
}