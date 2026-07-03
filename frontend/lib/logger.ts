type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogMethods {
  debug: (message: string, ...args: any[]) => void;
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
}

class Logger {
  private level: number;

  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor() {
    const envLevel = process.env.NEXT_PUBLIC_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug');
    this.level = this.levels[envLevel as LogLevel] ?? 0;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levels[level] >= this.level;
  }

  private log(level: LogLevel, category: string | undefined, message: string, ...args: any[]) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toLocaleTimeString();
    const levelStr = level.toUpperCase();
    const isBrowser = typeof window !== 'undefined';

    if (!isBrowser) {
      // Server-side logging: use standard console with simple colors (ANSI color codes)
      const colors: Record<LogLevel, string> = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
      };
      const reset = '\x1b[0m';
      const color = colors[level] || '';
      console.log(`[${timestamp}] ${color}[${levelStr}]${reset}${category ? ` [${category}]` : ''} ${message}`, ...args);
      return;
    }

    // Client-side logging: browser console with rich CSS styling
    const colors: Record<LogLevel, { bg: string; text: string }> = {
      debug: { bg: '#64748b', text: '#ffffff' }, // Slate
      info: { bg: '#10b981', text: '#ffffff' },  // Emerald
      warn: { bg: '#f59e0b', text: '#0f172a' },  // Amber
      error: { bg: '#ef4444', text: '#ffffff' }, // Red
    };

    const config = colors[level];
    const prefix = `%cTV%c${levelStr}%c${category ? ` %c${category.toUpperCase()}` : ''}%c ${message}`;
    const styles = [
      'background: #3b82f6; color: white; padding: 1px 3px; border-radius: 2px 0 0 2px; font-weight: bold; font-size: 10px;',
      `background: ${config.bg}; color: ${config.text}; padding: 1px 4px; border-radius: 0 2px 2px 0; font-weight: bold; font-size: 10px;`,
      'color: #0284c7; font-weight: bold;',
    ];

    if (category) {
      styles.push('color: #6366f1; font-weight: bold;');
    }
    styles.push('color: inherit;');

    if (level === 'error') {
      console.error(prefix, ...styles, ...args);
    } else if (level === 'warn') {
      console.warn(prefix, ...styles, ...args);
    } else if (level === 'info') {
      console.info(prefix, ...styles, ...args);
    } else {
      console.log(prefix, ...styles, ...args);
    }
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', undefined, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', undefined, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', undefined, message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', undefined, message, ...args);
  }

  withCategory(category: string): LogMethods {
    return {
      debug: (message, ...args) => this.log('debug', category, message, ...args),
      info: (message, ...args) => this.log('info', category, message, ...args),
      warn: (message, ...args) => this.log('warn', category, message, ...args),
      error: (message, ...args) => this.log('error', category, message, ...args),
    };
  }
}

export const logger = new Logger();
