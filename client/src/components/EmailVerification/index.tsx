import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../../context/Auth";

export const EmailVerification = () => {
  const { key } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (key) {
      auth
        .keyVerification(key)
        .then((res) => navigate("/home", { replace: true }))
        .catch(() => navigate("/login", { replace: true }));
    }
  }, [auth, key, navigate]);

  return null;
};
