-- CreateEnum
CREATE TYPE "event_rsvp_status" AS ENUM ('going', 'not_going', 'maybe');

-- CreateTable
CREATE TABLE "event_rsvps" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "status" "event_rsvp_status" NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("event_id","user_id")
);

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_user_id_group_id_fkey" FOREIGN KEY ("user_id", "group_id") REFERENCES "group_profiles"("user_id", "group_id") ON DELETE CASCADE ON UPDATE NO ACTION;
