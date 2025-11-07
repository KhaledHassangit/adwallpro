"use client";

import {
  MapPin as LucideMapPin,
  ChevronUp as LucideChevronUp,
  Activity as LucideActivity,
  Phone as LucidePhone,
  Mail as LucideMail,
  Globe as LucideGlobe,
  Plus as LucidePlus,
  Home as LucideHome,
  Grid3X3 as LucideGrid3X3,
  Settings as LucideSettings,
  Info as LucideInfo,
  Sun as LucideSun,
  Moon as LucideMoon,
  LogIn as LucideLogIn,
  LogOut as LucideLogOut,
  Shield as LucideShield,
  UserIcon as LucideUserIcon,
  Search as LucideSearch,
  Eye as LucideEye,
  PlusCircle as LucidePlusCircle,
  Users as LucideUsers,
  Building2 as LucideBuilding2,
  Tags as LucideTags,
  Ticket as LucideTicket,
  LayoutDashboard as LucideLayoutDashboard,
  BarChart3 as LucideBarChart3,
  User as LucideUser,
  Sparkles as LucideSparkles,
  TrendingUp as LucideTrendingUp,
  Clock as LucideClock,
  CheckCircle as LucideCheckCircle,
  Calendar as LucideCalendar,
  ArrowRight as LucideArrowRight,
  AlertCircle as LucideAlertCircle,
  DollarSign as LucideDollarSign,
  XCircle as LucideXCircle,
  Star as LucideStar,
  UserCheck as LucideUserCheck,
  Zap as LucideZap,
  Award as LucideAward,
  Loader2 as LucideLoader2,
  Filter as LucideFilter,
  List as LucideList,
  Edit as LucideEdit,
  Trash2 as LucideTrash2,
  UserPlus as LucideUserPlus,
  Crown as LucideCrown,
  MessageCircle as LucideMessageCircle,
  Check as LucideCheck,
  X as LucideX,
  MoreHorizontal as LucideMoreHorizontal,
  Upload as LucideUpload,
  Facebook as LucideFacebook,
  Target as LucideTarget,
  Instagram as LucideInstagram,
  Twitter as LucideTwitter,
  ChevronDown as LucideChevronDown,
  HelpCircle as LucideHelpCircle,
  ChevronLeft as LucideChevronLeft,
  ChevronRight as LucideChevronRight,
  Play as LucidePlay,
  Pause as LucidePause,
  Send as LucideSend,
  Bot as LucideBot,
  type LucideProps,
} from "lucide-react";

// إعادة تصدير الأيقونات مباشرة
export const MapPin = LucideMapPin;
export const Phone = LucidePhone;
export const Mail = LucideMail;
export const Globe = LucideGlobe;
export const Plus = LucidePlus;
export const Home = LucideHome;
export const Grid3X3 = LucideGrid3X3;
export const Settings = LucideSettings;
export const Info = LucideInfo;
export const Sun = LucideSun;
export const Moon = LucideMoon;
export const LogIn = LucideLogIn;
export const LogOut = LucideLogOut;
export const Shield = LucideShield;
export const UserIcon = LucideUserIcon;
export const Search = LucideSearch;
export const Eye = LucideEye;
export const PlusCircle = LucidePlusCircle;
export const Users = LucideUsers;
export const Building2 = LucideBuilding2;
export const Tags = LucideTags;
export const Ticket = LucideTicket;
export const LayoutDashboard = LucideLayoutDashboard;
export const BarChart3 = LucideBarChart3;
export const User = LucideUser;
export const Sparkles = LucideSparkles;
export const TrendingUp = LucideTrendingUp;
export const Clock = LucideClock;
export const CheckCircle = LucideCheckCircle;
export const Calendar = LucideCalendar;
export const ArrowRight = LucideArrowRight;
export const AlertCircle = LucideAlertCircle;
export const DollarSign = LucideDollarSign;
export const XCircle = LucideXCircle;
export const Star = LucideStar;
export const UserCheck = LucideUserCheck;
export const Zap = LucideZap;
export const Award = LucideAward;
export const Loader2 = LucideLoader2;
export const Filter = LucideFilter;
export const List = LucideList;
export const Edit = LucideEdit;
export const Trash2 = LucideTrash2;
export const UserPlus = LucideUserPlus;
export const Crown = LucideCrown;
export const MessageCircle = LucideMessageCircle;
export const Check = LucideCheck;
export const X = LucideX;
export const MoreHorizontal = LucideMoreHorizontal;
export const Upload = LucideUpload;
export const Facebook = LucideFacebook;
export const Target = LucideTarget;
export const Instagram = LucideInstagram;
export const Twitter = LucideTwitter;
export const ChevronDown = LucideChevronDown;
export const HelpCircle = LucideHelpCircle;
export const ChevronLeft = LucideChevronLeft;
export const ChevronRight = LucideChevronRight;
export const Play = LucidePlay;
export const Pause = LucidePause;
export const Send = LucideSend;
export const Bot = LucideBot;
export const Activity = LucideActivity;
export const ChevronUp = LucideChevronUp;

interface IconProps extends LucideProps {
  name: string;
}

const iconMap = {
  ChevronUp: LucideChevronUp,
  MapPin: LucideMapPin,
  Phone: LucidePhone,
  Mail: LucideMail,
  Globe: LucideGlobe,
  Plus: LucidePlus,
  Home: LucideHome,
  Grid3X3: LucideGrid3X3,
  Settings: LucideSettings,
  Info: LucideInfo,
  Sun: LucideSun,
  Moon: LucideMoon,
  LogIn: LucideLogIn,
  LogOut: LucideLogOut,
  Shield: LucideShield,
  UserIcon: LucideUserIcon,
  Search: LucideSearch,
  Eye: LucideEye,
  PlusCircle: LucidePlusCircle,
  Users: LucideUsers,
  Building2: LucideBuilding2,
  Tags: LucideTags,
  Ticket: LucideTicket,
  LayoutDashboard: LucideLayoutDashboard,
  BarChart3: LucideBarChart3,
  User: LucideUser,
  Sparkles: LucideSparkles,
  TrendingUp: LucideTrendingUp,
  Clock: LucideClock,
  CheckCircle: LucideCheckCircle,
  Calendar: LucideCalendar,
  ArrowRight: LucideArrowRight,
  AlertCircle: LucideAlertCircle,
  DollarSign: LucideDollarSign,
  XCircle: LucideXCircle,
  Star: LucideStar,
  UserCheck: LucideUserCheck,
  Zap: LucideZap,
  Award: LucideAward,
  Loader2: LucideLoader2,
  Filter: LucideFilter,
  List: LucideList,
  Edit: LucideEdit,
  Trash2: LucideTrash2,
  UserPlus: LucideUserPlus,
  Crown: LucideCrown,
  MessageCircle: LucideMessageCircle,
  Check: LucideCheck,
  X: LucideX,
  MoreHorizontal: LucideMoreHorizontal,
  Upload: LucideUpload,
  Facebook: LucideFacebook,
  Target: LucideTarget,
  Instagram: LucideInstagram,
  Twitter: LucideTwitter,
  ChevronDown: LucideChevronDown,
  HelpCircle: LucideHelpCircle,
  ChevronLeft: LucideChevronLeft,
  ChevronRight: LucideChevronRight,
  Play: LucidePlay,
  Pause: LucidePause,
  Send: LucideSend,
  Bot: LucideBot,
} as const;

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = iconMap[name as keyof typeof iconMap];

  if (!IconComponent) {
    return (
      <div
        className={`inline-block bg-muted-foreground/20 rounded ${props.className}`}
        style={{ width: "1em", height: "1em" }}
      />
    );
  }

  return <IconComponent {...props} />;
}
