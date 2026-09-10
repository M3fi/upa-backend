import { GameFactory } from './GameFactory';
import { SiONoTemplate } from '../templates/siono.template';

describe('GameFactory', () => {
  beforeEach(() => {
    GameFactory.reset();
  });

  it('should register and retrieve a template', () => {
    const template = new SiONoTemplate();
    GameFactory.register(template);
    expect(GameFactory.get('SiONo')).toBe(template);
  });

  it('should list registered templates', () => {
    GameFactory.register(new SiONoTemplate());
    expect(GameFactory.list()).toEqual(['SiONo']);
  });

  it('should throw when registering duplicate type', () => {
    GameFactory.register(new SiONoTemplate());
    expect(() => GameFactory.register(new SiONoTemplate())).toThrow();
  });

  it('should throw when getting unregistered type', () => {
    expect(() => GameFactory.get('NonExistent')).toThrow();
  });

  it('Open/Closed: adding a new template does not modify the factory', () => {
    // Register first template
    GameFactory.register(new SiONoTemplate());
    const before = GameFactory.list();

    // A new dummy template (simulates adding without modifying factory)
    const DummyTemplate = {
      templateType: 'Dummy',
      validate: () => {},
      checkAnswer: () => true,
      getScore: () => 100,
    };
    GameFactory.register(DummyTemplate);

    // The factory should have both, and the SiONo should work unchanged
    expect(GameFactory.get('SiONo')).toBeDefined();
    expect(GameFactory.get('Dummy')).toBeDefined();
    expect(GameFactory.list().length).toBe(2);
  });
});
