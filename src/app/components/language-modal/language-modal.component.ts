import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-modal',
  templateUrl: './language-modal.component.html',
  styleUrls: ['./language-modal.component.scss'],
  standalone:false
})
export class LanguageModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() languageChanged = new EventEmitter<string>();

  languages = [
    { code: 'es', name: 'Español', flag: 'assets/flags/es.png' },
    { code: 'en', name: 'English', flag: 'assets/flags/en.png' }
  ];

  selectedLanguage = 'es';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.selectedLanguage = this.translate.currentLang || 'es';
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
    this.languageChanged.emit(lang);
    this.close.emit(); // Cerrar el modal después de elegir idioma
  }
}
