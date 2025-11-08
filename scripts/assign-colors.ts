import { prisma } from "../src/lib/db/prisma";

const USER_COLORS = [
  "#2E6B3A",
  "#C96E2D",
  "#5A3A1E",
  "#E19A56",
  "#F3B94D",
  "#8B4513",
  "#228B22",
  "#CD853F",
  "#D2691E",
  "#B8860B",
  "#8FBC8F",
  "#BC8F8F",
];

export function getRandomUserColor(existingColors: string[] = []): string {
  const availableColors = USER_COLORS.filter(
    (color) => !existingColors.includes(color)
  );

  if (availableColors.length === 0) {
    return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
  }

  return availableColors[Math.floor(Math.random() * availableColors.length)];
}

export function getAllUserColors(): string[] {
  return [...USER_COLORS];
}

async function assignColorsToUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        color: true,
      },
    });

    console.log(`Found ${users.length} users`);

    const usersWithDefaultColor = users.filter(
      (user) => user.color === "#2E6B3A"
    );

    if (usersWithDefaultColor.length === 0) {
      console.log("All users already have unique colors assigned");
      return;
    }

    console.log(
      `${usersWithDefaultColor.length} users need color assignment`
    );

    const existingColors = users.map((user) => user.color);

    for (const user of usersWithDefaultColor) {
      const newColor = getRandomUserColor(existingColors);
      existingColors.push(newColor);

      await prisma.user.update({
        where: { id: user.id },
        data: { color: newColor },
      });

      console.log(`Assigned color ${newColor} to user ${user.username}`);
    }

    console.log("Color assignment complete!");
  } catch (error) {
    console.error("Error assigning colors:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

assignColorsToUsers();
