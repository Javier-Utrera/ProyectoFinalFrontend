import {
  Component, Input, Output, EventEmitter, ViewChild, ElementRef,
  OnInit, OnDestroy, AfterViewInit, ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() model: string = '';
  @Output() modelChange = new EventEmitter<string>();

  @ViewChild('editorElement') editorEl!: ElementRef<HTMLDivElement>;
  @ViewChild('editorToolbarElement') toolbarEl!: ElementRef<HTMLDivElement>;
  @ViewChild('editorMenuBarElement') menuEl!: ElementRef<HTMLDivElement>;

  private editor: any;

  ngAfterViewInit(): void {
    if ((window as any).DecoupledEditor) {
      this.initEditor();
    } else {
      const script = document.createElement('script');
      script.src = '/assets/ckeditor/ckeditor.js';
      script.onload = () => this.initEditor();
      document.body.appendChild(script);
    }
  }

  ngOnDestroy(): void {
    this.destroyEditor();
  }

  private async initEditor() {
    await this.destroyEditor();

    const DecoupledEditor = (window as any).DecoupledEditor;

    this.editor = await DecoupledEditor.create(this.editorEl.nativeElement, {
      placeholder: 'Escribe tu relato aquí...'
    });

    this.toolbarEl.nativeElement.appendChild(this.editor.ui.view.toolbar.element);

    const menu = this.editor.ui.view.menuBarView?.element;
    if (menu) this.menuEl.nativeElement.appendChild(menu);

    this.editor.setData(this.model);

    this.editor.model.document.on('change:data', () => {
      this.modelChange.emit(this.editor.getData());
    });
  }

  private async destroyEditor() {
    if (this.editor) {
      await this.editor.destroy();
      this.editor = null;
    }
  }

  ngOnInit(): void {}
}
