
"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Heart, Repeat2, Share, BadgeCheck } from 'lucide-react';
import type { Tweet } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TweetCardProps {
  tweet: Tweet;
}

const formatStat = (num: number): string => {
  if (num > 999999) return `${(num / 1000000).toFixed(1)}M`;
  if (num > 999) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function TweetCard({ tweet }: TweetCardProps) {
  const tweetUrl = `https://twitter.com/${tweet.author.username}/status/${tweet.id}`;
  // Shorten date for Twitter style (e.g., "4h", "2d")
  const date = new Date(tweet.created_at);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

  let formattedDate = '';
  if (diffInHours < 24) {
    formattedDate = `${Math.floor(diffInHours)}h`;
  } else {
    formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  return (
    <a href={tweetUrl} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="border-b border-[hsl(var(--border))] hover:bg-muted/30 transition-colors p-4 cursor-pointer w-full">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10 rounded-full border border-border/50">
              <AvatarImage src={tweet.author.profile_image_url} alt={tweet.author.name} />
              <AvatarFallback className="rounded-full">{tweet.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header: Name, Verified, Handle, Date */}
            <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
              <span className="font-bold text-[15px] truncate text-foreground">{tweet.author.name}</span>
              <BadgeCheck className="h-[18px] w-[18px] text-[#1D9BF0] fill-current" />
              <span className="text-[15px] text-muted-foreground truncate">@{tweet.author.username}</span>
              <span className="text-[15px] text-muted-foreground">·</span>
              <span className="text-[15px] text-muted-foreground hover:underline">
                {formattedDate}
              </span>
            </div>

            {/* Tweet Content */}
            <p className="mt-1 text-[15px] leading-normal text-foreground whitespace-pre-wrap break-words">
              {tweet.text}
            </p>

            {/* Action Bar */}
            <div className="mt-3 flex items-center justify-between max-w-[350px] text-muted-foreground">
              <div className="flex items-center group/reply text-muted-foreground hover:text-[#1D9BF0] transition-colors gap-2 text-xs">
                <div className="p-2 -ml-2 rounded-full group-hover/reply:bg-[#1D9BF0]/10 transition-colors">
                  <MessageSquare className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <span className="text-[13px]">{formatStat(tweet.public_metrics.reply_count)}</span>
              </div>

              <div className="flex items-center group/retweet text-muted-foreground hover:text-[#00BA7C] transition-colors gap-2 text-xs">
                <div className="p-2 -ml-2 rounded-full group-hover/retweet:bg-[#00BA7C]/10 transition-colors">
                  <Repeat2 className="h-[1.2rem] w-[1.2rem]" />
                </div>
                <span className="text-[13px]">{formatStat(tweet.public_metrics.retweet_count)}</span>
              </div>

              <div className="flex items-center group/like text-muted-foreground hover:text-[#F91880] transition-colors gap-2 text-xs">
                <div className="p-2 -ml-2 rounded-full group-hover/like:bg-[#F91880]/10 transition-colors">
                  <Heart className="h-[1.1rem] w-[1.1rem]" />
                </div>
                <span className="text-[13px]">{formatStat(tweet.public_metrics.like_count)}</span>
              </div>

              <div className="flex items-center group/share text-muted-foreground hover:text-[#1D9BF0] transition-colors gap-2 text-xs">
                <div className="p-2 -ml-2 rounded-full group-hover/share:bg-[#1D9BF0]/10 transition-colors">
                  <Share className="h-[1.1rem] w-[1.1rem]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
