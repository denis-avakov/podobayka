import tmi from 'tmi.js';
import { zeroWidthCharacters } from 'printable-characters';

const client = new tmi.Client({
  channels: ['den3er']
});

client.on('connected', () => {
  console.log('🔥');
});

// invisible 7tv suffix
const UNICODE_TAG_0 = '\u{E0000}';
const UNICODE_TAG_0_REGEX = new RegExp(UNICODE_TAG_0, 'g');

let chatStreakHistory: string[][] = [];
let isGoingDown = false;

const resetStreakHistory = () => {
  chatStreakHistory = [];
  isGoingDown = false;
};

client.on('message', (channel, tags, message, self) => {
  // remove the invisible 7tv suffix and any zero width chars
  const visibleCharsOnly = message
    .replace(UNICODE_TAG_0_REGEX, '')
    .replace(zeroWidthCharacters, '')
    .trim();

  // this makes sure "foo;;  & bar" returns ["foo", "&", "bar"]
  // instead of ["foo;;", "", "&", "bar"]
  const messageWords = visibleCharsOnly.split(' ').filter((word) => word);

  try {
    // a pyramid has been started before this message
    if (chatStreakHistory.length > 0) {
      if (messageWords.length > 0) {
        const streakWord = chatStreakHistory[chatStreakHistory.length - 1][0];
        const blocksDiff =
          messageWords.length - chatStreakHistory[chatStreakHistory.length - 1].length;

        if (Math.abs(blocksDiff) === 1) {
          let consistent = true;

          // make sure the pyramid consists of the same item
          for (const word of messageWords) {
            if (word !== streakWord) {
              consistent = false;
              break;
            }
          }

          if (consistent) {
            chatStreakHistory.push(messageWords);

            if (blocksDiff > 0) {
              if (isGoingDown) {
                resetStreakHistory();
              }
            } else if (blocksDiff < 0) {
              isGoingDown = true;

              // a pyramid was finished
              if (messageWords.length === 1) {
                let streak = 0;

                for (const row of chatStreakHistory) {
                  if (row.length > streak) {
                    streak = row.length;
                  }
                }

                const args = {
                  emote: streakWord,
                  width: streak
                };

                console.log('Pyramid completed!!', args);
                resetStreakHistory();
              }
            }
          } else {
            // break pyramid because not all parts of the message matches the `streakWord`
            // i.e. the building block of the pyramid, like catOK or KirbyPunch
            resetStreakHistory();
          }
        } else {
          // break pyramid because current message contained too many or too few words
          // e.g. the pyramid was in the following state:
          //
          // chatStreakHistory = [
          //   ['Kappa'],
          //   ['Kappa', 'Kappa']
          // ];
          //
          // and current message was "Kappa Kappa Kappa Kappa" or "Hi there hello there"
          // then we know there'd be a gap in the pyramid, so we don't do any block comparisons
          resetStreakHistory();
        }
      } else {
        // break pyramid because the current message is empty
        resetStreakHistory();
      }
    }

    // start pyramid using messageWords
    if (messageWords.length === 1 && chatStreakHistory.length === 0) {
      chatStreakHistory.push(messageWords);
    }
  } catch (error) {
    // in case I fucked up the code above
    console.error('Unhandled exception in pyramid parser 😱🔌', {
      message,
      messageWords
    });
  }

  console.debug(`_ ${tags['display-name']?.toLowerCase()}: ${message}`, {
    visibleCharsOnly,
    messageWords,
    chatStreakHistory,
    isGoingDown
  });
});

client.connect();
