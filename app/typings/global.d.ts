type ISafeAny = any;

interface Window {
  __GLOBAL__TOKEN__: string;
  GlobalBridge: {
    returnAuthPage?: () => void;
  };
}
