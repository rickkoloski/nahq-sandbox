-- NAHQ Accelerate — AI Generation Log
-- Tracks all LLM interactions for auditability and cost monitoring

CREATE TABLE ai_generation_log (
    id              BIGSERIAL PRIMARY KEY,
    generation_type VARCHAR(50) NOT NULL,
    user_id         BIGINT REFERENCES app_user(id),
    organization_id BIGINT REFERENCES organization(id),
    prompt_hash     VARCHAR(64) NOT NULL,
    context_summary TEXT,
    response_text   TEXT,
    model           VARCHAR(50),
    input_tokens    INT,
    output_tokens   INT,
    latency_ms      BIGINT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_log_user ON ai_generation_log(user_id);
CREATE INDEX idx_ai_log_type ON ai_generation_log(generation_type);
CREATE INDEX idx_ai_log_created ON ai_generation_log(created_at);
