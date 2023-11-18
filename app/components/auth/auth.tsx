import styles from "./auth.module.scss";
import { IconButton } from "../button";

import { useNavigate } from "react-router-dom";
import { Path } from "../../constant";
import { useAccessStore } from "../../store";
import Locale from "../../locales";

import BotIcon from "../../icons/bot.svg";
import { useEffect } from "react";
import { getClientConfig } from "../../config/client";
import { Button, Input, Space } from "antd";

export function AuthPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  const goHome = () => navigate(Path.Home);
  const goChat = () => navigate(Path.Chat);
  const resetAccessCode = () => {
    accessStore.update((access) => {
      access.openaiApiKey = "";
      access.accessCode = "";
    });
  }; // Reset access code to empty string

  const handleLogIn = async () => {
    await accessStore.logIn();
    goChat();
  };
  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Auth.Tips}</div>
      <div className={styles.line}>
        账号
        <Input
          className={styles.input}
          placeholder={Locale.Auth.Username}
          value={accessStore.username}
          onChange={(e) => {
            accessStore.update(
              (access) => (access.username = e.currentTarget.value),
            );
          }}
        ></Input>
      </div>

      <div className={styles.line}>
        密码
        <Input
          type="password"
          className={styles.input}
          placeholder={Locale.Auth.Password}
          value={accessStore.password}
          onChange={(e) => {
            accessStore.update(
              (access) => (access.password = e.currentTarget.value),
            );
          }}
        ></Input>
      </div>

      <div className={styles["auth-actions"]}>
        <Button
          type="primary"
          onClick={handleLogIn}
          style={{ backgroundColor: "var(--primary)" }}
        >
          {Locale.Auth.Confirm}
        </Button>
      </div>
    </div>
  );
}
