import { atom } from "recoil"

export const menuState = atom({
  key: 'MenuState',
  default: {
    drawerOpen: true,
    openItem: [] as string[]
  },
});

export const userState = atom({
  key: 'UserState',
  default: {
    name: undefined,
    email: undefined
  },
});