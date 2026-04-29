"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  IdCard,
  ReceiptText,
  RotateCcw,
  Vote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StageKey = "verification" | "ink" | "evm" | "complete";

type DocumentOption = {
  id: string;
  label: string;
  hint: string;
  type: "identity" | "slip" | "invalid";
};

type Candidate = {
  id: string;
  name: string;
  party: string;
  symbol: string;
  accent: string;
};

const stages: { key: StageKey; title: string; hint: string }[] = [
  {
    key: "verification",
    title: "Document Check",
    hint: "Choose valid proof and booth slip.",
  },
  {
    key: "ink",
    title: "Ink Mark",
    hint: "Mark the left index finger.",
  },
  {
    key: "evm",
    title: "EVM Vote",
    hint: "Cast and confirm your choice.",
  },
  {
    key: "complete",
    title: "Completion",
    hint: "Review the finished booth flow.",
  },
];

const documentOptions: DocumentOption[] = [
  {
    id: "epic",
    label: "EPIC voter ID",
    hint: "Accepted photo identity proof.",
    type: "identity",
  },
  {
    id: "passport",
    label: "Passport",
    hint: "Accepted alternate identity proof.",
    type: "identity",
  },
  {
    id: "slip",
    label: "Polling booth slip",
    hint: "Used to confirm booth and serial details.",
    type: "slip",
  },
  {
    id: "phone",
    label: "Phone screenshot",
    hint: "Not valid as identity proof.",
    type: "invalid",
  },
];

const candidates: Candidate[] = [
  {
    id: "c1",
    name: "Asha Verma",
    party: "Civic Reform Front",
    symbol: "RF",
    accent: "bg-emerald-500",
  },
  {
    id: "c2",
    name: "Rohan Iyer",
    party: "People's Alliance Bloc",
    symbol: "PA",
    accent: "bg-sky-500",
  },
  {
    id: "c3",
    name: "Meera Khan",
    party: "Jan Shakti Forum",
    symbol: "JS",
    accent: "bg-amber-500",
  },
  {
    id: "c4",
    name: "Dev Malik",
    party: "Green Citizen League",
    symbol: "GC",
    accent: "bg-lime-500",
  },
  {
    id: "nota",
    name: "None Of The Above",
    party: "NOTA",
    symbol: "NO",
    accent: "bg-zinc-500",
  },
];

function Lamp({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white/70 px-3 py-2 text-center">
      <div
        className={cn(
          "mx-auto h-3.5 w-3.5 rounded-full border border-black/10 transition-all duration-300",
          active ? "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" : "bg-zinc-300"
        )}
      />
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-600">
        {label}
      </p>
    </div>
  );
}

function HandButton({
  label,
  active,
  className,
  disabled,
  onClick,
}: {
  label: string;
  active?: boolean;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "absolute rounded-[999px] border border-[#946b59] bg-[#e6b8a0] transition-all duration-300",
        "shadow-[inset_0_2px_8px_rgba(255,255,255,0.45),0_12px_30px_rgba(75,36,20,0.1)]",
        active &&
          "bg-[#ddb5d6] before:absolute before:inset-x-[22%] before:top-[10%] before:h-[68%] before:rounded-full before:bg-[#52366d]",
        className
      )}
    />
  );
}

export default function SimulationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [deskStatus, setDeskStatus] = useState("Select one valid ID and the polling booth slip.");
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [fingerMarked, setFingerMarked] = useState(false);
  const [inkStatus, setInkStatus] = useState("Tap the left index finger to apply the ink mark.");
  const [castCandidateId, setCastCandidateId] = useState<string | null>(null);
  const [vvpatChecked, setVvpatChecked] = useState(false);
  const [evmStatus, setEvmStatus] = useState(
    "Press one candidate button when the ballot unit is ready."
  );

  const selectedDocumentDetails = documentOptions.filter((document) =>
    selectedDocs.includes(document.id)
  );
  const hasIdentity = selectedDocumentDetails.some((document) => document.type === "identity");
  const hasSlip = selectedDocumentDetails.some((document) => document.type === "slip");
  const hasInvalid = selectedDocumentDetails.some((document) => document.type === "invalid");
  const selectedCandidate =
    candidates.find((candidate) => candidate.id === castCandidateId) ?? null;

  const maxUnlockedStep = vvpatChecked ? 3 : fingerMarked ? 2 : documentsVerified ? 1 : 0;

  const canContinue =
    (currentStep === 0 && documentsVerified) ||
    (currentStep === 1 && fingerMarked) ||
    (currentStep === 2 && vvpatChecked);

  const toggleDocument = (documentId: string) => {
    if (documentsVerified) return;

    setSelectedDocs((current) =>
      current.includes(documentId)
        ? current.filter((id) => id !== documentId)
        : [...current, documentId]
    );
  };

  const verifyDocuments = () => {
    if (!hasIdentity || !hasSlip) {
      setDeskStatus("Use one accepted ID and the polling booth slip.");
      return;
    }

    if (hasInvalid) {
      setDeskStatus("Remove the phone screenshot. It is not accepted.");
      return;
    }

    setDocumentsVerified(true);
    setDeskStatus("Documents verified. Move to the ink desk.");
  };

  const markFinger = (finger: "thumb" | "index" | "middle" | "ring" | "little") => {
    if (!documentsVerified || fingerMarked) return;

    if (finger !== "index") {
      setInkStatus("Use the left index finger.");
      return;
    }

    setFingerMarked(true);
    setInkStatus("Ink applied correctly. Proceed to the EVM.");
  };

  const castVote = (candidateId: string) => {
    if (!fingerMarked || castCandidateId) return;

    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate) return;

    setCastCandidateId(candidateId);
    setEvmStatus(`Vote locked for ${candidate.name}. Check the VVPAT slip.`);
  };

  const confirmVvpat = () => {
    if (!castCandidateId) return;

    setVvpatChecked(true);
    setEvmStatus("VVPAT confirmed. The voting sequence is complete.");
  };

  const resetSimulation = () => {
    setCurrentStep(0);
    setSelectedDocs([]);
    setDeskStatus("Select one valid ID and the polling booth slip.");
    setDocumentsVerified(false);
    setFingerMarked(false);
    setInkStatus("Tap the left index finger to apply the ink mark.");
    setCastCandidateId(null);
    setVvpatChecked(false);
    setEvmStatus("Press one candidate button when the ballot unit is ready.");
  };

  const nextStep = () => {
    setCurrentStep((step) => Math.min(step + 1, 3));
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,207,138,0.35),_transparent_28%),linear-gradient(180deg,#f6f1e4_0%,#efe5cf_52%,#e4d6bc_100%)] text-[#1b221b]">
      <div className="w-full px-4 py-8 md:px-6 lg:px-8 lg:py-10">
        <section className="rounded-[2rem] border border-black/10 bg-[#1f3d32] px-6 py-7 text-[#f8f1df] shadow-[0_28px_80px_rgba(31,61,50,0.22)] md:px-8 lg:px-10">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#cad6c5]">
                Voting Booth Simulator
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                Real booth flow, one step at a time.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#dce5d6]">
                Verify documents, mark the finger, vote in the EVM, then check the VVPAT slip. The
                page now moves stage by stage for a cleaner practice flow.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm text-[#eef3ea]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b8c8b4]">
                Progress
              </span>
              <span className="text-lg font-semibold">{currentStep + 1}/4</span>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-[1.8rem] border border-black/8 bg-white/75 p-4 shadow-[0_18px_50px_rgba(61,44,20,0.08)] backdrop-blur">
            <div className="space-y-3">
              {stages.map((stage, index) => {
                const unlocked = index <= maxUnlockedStep;
                const active = currentStep === index;
                const complete = index < maxUnlockedStep || (index === 3 && vvpatChecked);

                return (
                  <button
                    key={stage.key}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      "w-full rounded-[1.3rem] border p-4 text-left transition-all duration-300",
                      active ? "border-[#1f7a59]/35 bg-[#eef8ee]" : "border-black/8 bg-white",
                      !unlocked && "cursor-not-allowed opacity-55"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          complete
                            ? "bg-[#1f7a59] text-white"
                            : active
                              ? "bg-[#e9c56c] text-[#223224]"
                              : "bg-[#f0e5c8] text-[#677264]"
                        )}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1f261f]">{stage.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[#667163]">{stage.hint}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={resetSimulation}
              variant="outline"
              className="mt-4 w-full rounded-full border-black/10 bg-transparent"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restart
            </Button>
          </aside>

          <div className="space-y-6">
            {currentStep === 0 && (
              <Card className="rounded-[2rem] border border-black/8 bg-white/80 py-0 shadow-[0_22px_60px_rgba(61,44,20,0.08)]">
                <CardHeader className="border-b border-black/6 px-6 py-6">
                  <CardTitle className="flex items-center gap-3 text-left text-3xl font-semibold tracking-[-0.03em] text-[#202620] normal-case">
                    <IdCard className="h-7 w-7 text-[#1f7a59]" />
                    Document Verification Desk
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 px-6 py-6 xl:grid-cols-[1.3fr_0.7fr]">
                  <div className="grid gap-3 md:grid-cols-2">
                    {documentOptions.map((document) => {
                      const selected = selectedDocs.includes(document.id);
                      return (
                        <button
                          key={document.id}
                          type="button"
                          disabled={documentsVerified}
                          onClick={() => toggleDocument(document.id)}
                          className={cn(
                            "rounded-[1.4rem] border p-5 text-left transition-all duration-300",
                            selected
                              ? "border-[#1f7a59]/35 bg-[#eef8ee]"
                              : "border-black/8 bg-white"
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-base font-semibold text-[#1f261f]">
                              {document.label}
                            </p>
                            <span
                              className={cn(
                                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
                                document.type === "invalid"
                                  ? "bg-rose-100 text-rose-700"
                                  : document.type === "slip"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                              )}
                            >
                              {document.type}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-[#657162]">{document.hint}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className="rounded-[1.6rem] border border-black/8 bg-[#f6ecd5] p-5"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6d705c]">
                      Desk Response
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#566254]">{deskStatus}</p>
                    <div className="mt-5 space-y-2 text-sm text-[#616c5d]">
                      <p>{hasIdentity ? "Accepted ID selected" : "Need one accepted ID"}</p>
                      <p>{hasSlip ? "Booth slip selected" : "Need the booth slip"}</p>
                      <p>{hasInvalid ? "Invalid proof selected" : "No invalid proof selected"}</p>
                    </div>
                    <Button
                      onClick={verifyDocuments}
                      disabled={documentsVerified}
                      className="mt-6 w-full rounded-full bg-[#1f7a59] text-white hover:bg-[#175f45]"
                    >
                      {documentsVerified ? "Verified" : "Verify Documents"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 1 && (
              <Card className="rounded-[2rem] border border-black/8 bg-[#fffaf0] py-0 shadow-[0_22px_60px_rgba(61,44,20,0.08)]">
                <CardHeader className="border-b border-black/6 px-6 py-6">
                  <CardTitle className="flex items-center gap-3 text-left text-3xl font-semibold tracking-[-0.03em] text-[#202620] normal-case">
                    <Fingerprint className="h-7 w-7 text-[#52366d]" />
                    Indelible Ink Stage
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 px-6 py-6 xl:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative mx-auto h-[24rem] w-full max-w-[34rem] rounded-[2rem] border border-[#866275]/15 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.85),transparent_32%),linear-gradient(180deg,#f1d8ca_0%,#e7c2af_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_50px_rgba(82,54,109,0.12)]">
                    <div className="absolute inset-x-[28%] bottom-8 h-[9rem] rounded-[2.7rem] border border-[#9e7b6d] bg-[#e7baa2]" />
                    <HandButton
                      label="Left thumb"
                      onClick={() => markFinger("thumb")}
                      disabled={!documentsVerified || fingerMarked}
                      className="left-[17%] top-[47%] h-[5rem] w-[2.9rem] rotate-[-30deg]"
                    />
                    <HandButton
                      label="Left index finger"
                      active={fingerMarked}
                      onClick={() => markFinger("index")}
                      disabled={!documentsVerified || fingerMarked}
                      className="left-[28%] top-[12%] h-[9.3rem] w-[3.1rem]"
                    />
                    <HandButton
                      label="Left middle finger"
                      onClick={() => markFinger("middle")}
                      disabled={!documentsVerified || fingerMarked}
                      className="left-[40%] top-[5%] h-[10.1rem] w-[3.1rem]"
                    />
                    <HandButton
                      label="Left ring finger"
                      onClick={() => markFinger("ring")}
                      disabled={!documentsVerified || fingerMarked}
                      className="left-[52%] top-[12%] h-[8.8rem] w-[2.95rem]"
                    />
                    <HandButton
                      label="Left little finger"
                      onClick={() => markFinger("little")}
                      disabled={!documentsVerified || fingerMarked}
                      className="left-[65%] top-[22%] h-[6.8rem] w-[2.5rem]"
                    />
                  </div>

                  <div
                    className="rounded-[1.6rem] border border-black/8 bg-white p-5"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#786f84]">
                      Instruction
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[#5b5561]">
                      {documentsVerified ? inkStatus : "Finish document verification first."}
                    </p>
                    <div className="mt-5 rounded-[1.2rem] border border-black/6 bg-[#f8f5fb] p-4 text-sm text-[#5c5660]">
                      Real booth rule: the ink is placed on the left index finger before the voter
                      enters the voting compartment.
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="rounded-[2rem] border border-black/8 bg-[#edf3ed] py-0 shadow-[0_22px_60px_rgba(41,61,46,0.12)]">
                <CardHeader className="border-b border-black/6 px-6 py-6">
                  <CardTitle className="flex items-center gap-3 text-left text-3xl font-semibold tracking-[-0.03em] text-[#202620] normal-case">
                    <Vote className="h-7 w-7 text-[#1f7a59]" />
                    EVM And VVPAT
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-6 py-6">
                  <div className="grid gap-6 xl:grid-cols-[1.4fr_0.65fr]">
                    <div className="rounded-[1.8rem] border border-[#1f3d32]/12 bg-[#dbe6db] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5d675e]">
                            Ballot Unit
                          </p>
                          <p className="mt-2 text-sm text-[#526051]">
                            Press one blue button beside the candidate.
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <Lamp label="Ready" active={fingerMarked && !castCandidateId} />
                          <Lamp label="Vote" active={Boolean(castCandidateId) && !vvpatChecked} />
                          <Lamp label="Done" active={vvpatChecked} />
                        </div>
                      </div>

                      <div className="mt-5 space-y-3 rounded-[1.6rem] border border-[#173127]/12 bg-[#f7fbf7] p-4">
                        {candidates.map((candidate, index) => {
                          const chosen = castCandidateId === candidate.id;
                          const locked = Boolean(castCandidateId);

                          return (
                            <div
                              key={candidate.id}
                              className={cn(
                                "grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[1.25rem] border px-3 py-3 transition-all duration-300",
                                chosen
                                  ? "border-[#1f7a59]/35 bg-[#eaf7ea]"
                                  : "border-black/6 bg-white"
                              )}
                            >
                              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-[#f3ead2] text-sm font-semibold text-[#223224]">
                                {index + 1}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#1f271f]">
                                  {candidate.name}
                                </p>
                                <p className="mt-1 text-sm text-[#5f6c5f]">{candidate.party}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => castVote(candidate.id)}
                                disabled={!fingerMarked || locked}
                                aria-label={`Vote for ${candidate.name}`}
                                className={cn(
                                  "flex items-center gap-3 rounded-full border px-3 py-2 transition-all duration-300",
                                  chosen
                                    ? "border-[#1f7a59]/30 bg-[#f2fbf2]"
                                    : "border-black/8 bg-[#f7faf7]"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold text-white",
                                    candidate.accent
                                  )}
                                >
                                  {candidate.symbol}
                                </span>
                                <span className="h-10 w-10 rounded-full border border-[#2a54cc]/40 bg-[#3a68e5] shadow-[inset_0_0_0_3px_rgba(255,255,255,0.65)]" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-[1.8rem] border border-black/8 bg-[#f4edd7] p-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6e6a58]">
                          VVPAT Window
                        </p>
                        <div className="mt-4 rounded-[1.3rem] border border-dashed border-[#6f8d78]/40 bg-white/70 p-4">
                          {selectedCandidate ? (
                            <div className="space-y-3">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#7d7d6a]">
                                Printed Slip
                              </p>
                              <div className="rounded-[1rem] border border-black/8 bg-white p-4">
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-[#1e261e]">
                                      {selectedCandidate.name}
                                    </p>
                                    <p className="mt-1 text-sm text-[#60705f]">
                                      {selectedCandidate.party}
                                    </p>
                                  </div>
                                  <span
                                    className={cn(
                                      "flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white",
                                      selectedCandidate.accent
                                    )}
                                  >
                                    {selectedCandidate.symbol}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm leading-7 text-[#656c61]">
                              No slip yet. Cast a vote first.
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={confirmVvpat}
                          disabled={!selectedCandidate || vvpatChecked}
                          className="mt-5 w-full rounded-full bg-[#1f7a59] text-white hover:bg-[#175f45]"
                        >
                          {vvpatChecked ? "Confirmed" : "This Matches My Vote"}
                          <CheckCircle2 className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div
                        className="rounded-[1.8rem] border border-black/8 bg-white p-5"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#5e685f]">
                          Status
                        </p>
                        <p className="mt-4 text-sm leading-7 text-[#566253]">{evmStatus}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="rounded-[2rem] border border-black/8 bg-white/80 py-0 shadow-[0_22px_60px_rgba(61,44,20,0.08)]">
                <CardHeader className="border-b border-black/6 px-6 py-6">
                  <CardTitle className="flex items-center gap-3 text-left text-3xl font-semibold tracking-[-0.03em] text-[#202620] normal-case">
                    <ReceiptText className="h-7 w-7 text-[#1f7a59]" />
                    Booth Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 px-6 py-6 xl:grid-cols-[1fr_0.8fr]">
                  <div className="rounded-[1.8rem] border border-[#1f7a59]/16 bg-[#eff8ee] p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-[#1f7a59]" />
                      <p className="text-lg font-semibold text-[#1f2a1f]">
                        Full sequence completed
                      </p>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#566353]">
                      You completed the booth flow in the right order: documents, finger mark, EVM
                      vote, then VVPAT check.
                    </p>
                  </div>

                  <div className="rounded-[1.8rem] border border-black/8 bg-[#f6ecd5] p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6d705c]">
                      Final Record
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-[#566254]">
                      <p>{documentsVerified ? "Documents verified" : "Documents not verified"}</p>
                      <p>{fingerMarked ? "Left index finger marked" : "Ink not applied"}</p>
                      <p>
                        {selectedCandidate
                          ? `Vote cast for ${selectedCandidate.name}`
                          : "No candidate selected"}
                      </p>
                      <p>{vvpatChecked ? "VVPAT checked" : "VVPAT not checked"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.8rem] border border-black/8 bg-white/70 px-5 py-4 shadow-[0_18px_50px_rgba(61,44,20,0.06)]">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
                className="rounded-full border-black/10"
              >
                Previous
              </Button>

              <p className="text-sm text-[#62705f]">{stages[currentStep]?.hint}</p>

              {currentStep < 3 ? (
                <Button
                  onClick={nextStep}
                  disabled={!canContinue}
                  className="rounded-full bg-[#1f7a59] text-white hover:bg-[#175f45]"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={resetSimulation}
                  className="rounded-full bg-[#1f7a59] text-white hover:bg-[#175f45]"
                >
                  Run Again
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
