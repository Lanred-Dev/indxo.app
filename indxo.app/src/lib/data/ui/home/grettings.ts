export interface GreetingMessage {
    title: string;
    subtitle: string;
}

export enum TimeOfDay {
    morning,
    afternoon,
    evening,
    night,
}

export const greetings: Record<TimeOfDay, GreetingMessage[]> = {
    [TimeOfDay.morning]: [
        {
            title: "Starting your day off right, {name}?",
            subtitle: "Always a good time to learn something new.",
        },
        {
            title: "Good morning, {name}!",
            subtitle: "Fresh start, fresh focus. Let's make today count.",
        },
        {
            title: "Rise and shine, {name}!",
            subtitle: "A quick review session pairs great with morning coffee.",
        },
        {
            title: "Ready to conquer the morning, {name}?",
            subtitle: "Consistent small wins lead to big progress.",
        },
    ],
    [TimeOfDay.afternoon]: [
        {
            title: "Getting through the day, {name}?",
            subtitle: "Keep your brain sharp with some learning.",
        },
        {
            title: "Good afternoon, {name}!",
            subtitle: "Power through the midday slump with a quick study session.",
        },
        {
            title: "Taking a afternoon study break, {name}?",
            subtitle: "A few minutes of practice now saves time later.",
        },
        {
            title: "Halfway through the day, {name}!",
            subtitle: "Keep up the momentum and stay on track.",
        },
    ],
    [TimeOfDay.evening]: [
        {
            title: "Winding down with some learning, {name}?",
            subtitle: "Just don't get too comfortable, you might fall asleep.",
        },
        {
            title: "Good evening, {name}!",
            subtitle: "Great time to reflect and reinforce what you learned today.",
        },
        {
            title: "Settling in for the night, {name}?",
            subtitle: "A light review session before bed helps solidify memory.",
        },
        {
            title: "Ending the day strong, {name}?",
            subtitle: "Clear out a few more terms before calling it a day.",
        },
    ],
    [TimeOfDay.night]: [
        {
            title: "A little late, isn't it, {name}?",
            subtitle: "It's never too late to learn something new.",
        },
        {
            title: "Burning the midnight oil, {name}?",
            subtitle: "Remember to get enough rest after this session!",
        },
        {
            title: "Night owl mode activated, {name}!",
            subtitle: "Quiet hours make for great focus, but don't stay up too late.",
        },
        {
            title: "Late-night review, {name}?",
            subtitle: "Wrap up this set and get some well-deserved sleep.",
        },
    ],
};
