"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

let attemptCount = 0;

export default function AnalyticsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    const router = useRouter();
    const [attempts, setAttempts] = useState(attemptCount);

    useEffect(() => {
        console.error(error);
    }, [error]);

    function retry() {
        attemptCount += 1;
        setAttempts(attemptCount);
        router.refresh();
        reset();
    }

    return (
        <div>
            <h2>Something went wrong! Analytics Unavailable!</h2>
            <p>We&apos;re looking into it</p>
            {error.digest && <p>Reference: {error.digest}</p>}
            {attempts < 3 ? (
                <button onClick={retry}>Try again ({attempts}/3)</button>
            ) : (
                <p>Still Failing. Try again later!</p>
            )}
        </div>
    );
}
