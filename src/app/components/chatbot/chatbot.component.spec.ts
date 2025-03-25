import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatbotComponent } from './chatbot.component';
import { FormsModule } from '@angular/forms';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with welcome message', () => {
    expect(component.messages.length).toBe(1);
    expect(component.messages[0].text).toContain('¡Hola! Soy el asistente virtual de BookSwap');
    expect(component.messages[0].isUser).toBeFalse();
  });

  it('should toggle chat window', () => {
    expect(component.isOpen).toBeFalse();
    component.toggleChat();
    expect(component.isOpen).toBeTrue();
    component.toggleChat();
    expect(component.isOpen).toBeFalse();
  });

  it('should process user message and add bot response', () => {
    const userMessage = '¿Cómo funciona?';
    component.newMessage = userMessage;
    component.sendMessage();
    
    expect(component.messages.length).toBeGreaterThan(1);
    expect(component.messages[component.messages.length - 1].isUser).toBeFalse();
    expect(component.messages[component.messages.length - 1].text).toContain('BookSwap es una plataforma');
  });

  it('should not send empty messages', () => {
    const initialMessagesCount = component.messages.length;
    component.newMessage = '   ';
    component.sendMessage();
    expect(component.messages.length).toBe(initialMessagesCount);
  });
}); 