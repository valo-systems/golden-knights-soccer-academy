import { AlertTriangle, CheckCircle2, CreditCard, Wallet, type LucideIcon } from "lucide-react";
import {
  getPaymentFollowUps,
  memberJoiningFeeDueCents,
  memberPaymentDueCents,
  paymentFollowUpTotalCents,
  renewalState,
  useAdmin,
} from "@/admin/store";
import { AdminHeader, Card, RenewalBadge, WhatsAppLink, formatDate } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { formatZAR } from "@/lib/utils";

export function AdminRenewals() {
  const { members, payments, fees, recordPayment } = useAdmin();
  const attention = getPaymentFollowUps(members);
  const collectedThisYear = payments
    .filter((p) => p.status === "paid" && p.paidAt?.startsWith(String(new Date().getFullYear())))
    .reduce((sum, p) => sum + p.amountCents, 0);
  const outstandingCents = paymentFollowUpTotalCents(members);

  return (
    <>
      <AdminHeader
        title="Renewals"
        subtitle={`${formatZAR(fees.monthlyFeeCents)} per player per month, plus ${formatZAR(fees.joiningFeeCents)} once-off joining fee for new members.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          icon={AlertTriangle}
          label="Due / overdue"
          value={String(attention.length)}
          tone={attention.length ? "alert" : "normal"}
        />
        <Metric icon={Wallet} label="Outstanding" value={formatZAR(outstandingCents)} />
        <Metric icon={CheckCircle2} label="Collected this year" value={formatZAR(collectedThisYear)} />
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-bold text-foreground">Renewals needing attention</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            New converted members also appear here until the joining fee and first monthly fee are recorded.
          </p>
        </div>

        {attention.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No due or overdue renewals right now.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {attention.map((m) => (
              <div
                key={m.id}
                className="grid gap-4 p-5 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto] md:items-center"
              >
                <div>
                  <p className="font-bold text-foreground">
                    {m.firstName} {m.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {m.team} · Guardian: {m.guardianName}
                  </p>
                  <WhatsAppLink phone={m.guardianPhone} className="mt-1" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Next payment date
                  </p>
                  <p className="mt-1 font-semibold text-foreground">{formatDate(m.nextRenewal)}</p>
                </div>
                <div>
                  <RenewalBadge state={renewalState(m)} />
                  <p className="mt-1 text-sm font-bold text-foreground">
                    {formatZAR(memberPaymentDueCents(m))}
                  </p>
                  {memberJoiningFeeDueCents(m) > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Includes {formatZAR(memberJoiningFeeDueCents(m))} joining fee
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Button type="button" onClick={() => recordPayment(m.id)}>
                    Mark paid
                  </Button>
                  <Button type="button" variant="outline" disabled title="Future payment gateway">
                    <CreditCard /> Pay online soon
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="mt-6 border-primary/30 bg-accent p-5">
        <div className="flex items-start gap-3">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-bold text-foreground">Future online payment flow</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The UI already shows where a payment gateway can sit later. In the real build, online
              payment success would create the payment row and advance the next monthly fee date automatically.
            </p>
          </div>
        </div>
      </Card>
    </>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone = "normal",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: "normal" | "alert";
}) {
  return (
    <Card className="p-5">
      <span
        className={`inline-flex size-10 items-center justify-center rounded-xl ${
          tone === "alert" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="size-5" />
      </span>
      <p className="mt-4 font-heading text-3xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </Card>
  );
}
