CREATE INDEX "idx_exec_user_created" ON "guardrail_executions" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_exec_user_passed" ON "guardrail_executions" USING btree ("user_id","passed");--> statement-breakpoint
CREATE INDEX "idx_exec_user_profile" ON "guardrail_executions" USING btree ("user_id","profile_id");