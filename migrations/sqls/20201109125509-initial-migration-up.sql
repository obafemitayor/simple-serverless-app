CREATE TABLE doctors (
  doctor_id           BIGSERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  city                TEXT NOT NULL,
  country             TEXT NOT NULL,
  avatar_url           TEXT NOT NULL,
  quno_score_number     NUMERIC NOT NULL,
  ratings_average      NUMERIC NOT NULL,
  treatments_last_year  INTEGER NOT NULL,
  years_experience     INTEGER NOT NULL,
  base_price           NUMERIC NOT NULL,
  slug                TEXT,
  date_created        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);