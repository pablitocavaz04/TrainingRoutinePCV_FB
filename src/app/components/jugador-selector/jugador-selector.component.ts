import { Component, forwardRef, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-jugador-selector',
  templateUrl: './jugador-selector.component.html',
  styleUrls: ['./jugador-selector.component.scss'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => JugadorSelectorComponent),
      multi: true
    }
  ]
})
export class JugadorSelectorComponent implements ControlValueAccessor, OnInit {
  @Input() capacidadMaxima: number = 0;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  jugadores: any[] = [];
  jugadoresSeleccionados: any[] = [];
  errorCapacidad: string = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  isDragging = false;
  startX = 0;
  scrollLeft = 0;

  constructor() {}

  async ngOnInit() {
    await this.cargarJugadores();
    if (this.jugadoresSeleccionados.length > 0) {
      this.writeValue(this.jugadoresSeleccionados.map(j => j.id));
    }
  }

  async cargarJugadores() {
    const db = getFirestore();
    const jugadoresRef = collection(db, 'personas');
    const jugadoresSnapshot = await getDocs(query(jugadoresRef, where('roles', 'array-contains', 'Jugador')));

    this.jugadores = jugadoresSnapshot.docs.map(doc => ({
      id: doc.id,
      userEmail: doc.data()['userEmail'] || 'Correo no disponible',
      imagen: doc.data()['userImage'] || 'assets/default-avatar.png'
    }));
  }

  seleccionarJugador(jugador: any) {
    if (this.jugadoresSeleccionados.includes(jugador)) {
      this.jugadoresSeleccionados = this.jugadoresSeleccionados.filter(j => j.id !== jugador.id);
    } else {
      if (this.jugadoresSeleccionados.length < this.capacidadMaxima) {
        this.jugadoresSeleccionados.push(jugador);
      } else {
        this.errorCapacidad = `Máximo ${this.capacidadMaxima} jugadores permitidos.`;
        return;
      }
    }

    this.errorCapacidad = '';
    this.onChange(this.jugadoresSeleccionados.map(j => j.id));
  }

  writeValue(value: any): void {
    if (!value || !Array.isArray(value)) {
      this.jugadoresSeleccionados = [];
      return;
    }
    if (this.jugadores.length > 0) {
      this.jugadoresSeleccionados = this.jugadores.filter(j => value.includes(j.id));
    } else {
      setTimeout(() => this.writeValue(value), 500);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = (value: any) => {
      this.jugadoresSeleccionados = this.jugadores.filter(j => value.includes(j.id));
      fn(value);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  startDragging(event: MouseEvent, container: HTMLElement) {
    this.isDragging = true;
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
  }

  stopDragging() {
    this.isDragging = false;
  }

  onDragging(event: MouseEvent, container: HTMLElement) {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2; // Ajusta la velocidad del desplazamiento
    container.scrollLeft = this.scrollLeft - walk;
  }
}
