#!/usr/bin/env bash

set -e

JSON_MODE=false
SHORT_NAME=""
BRANCH_TYPE=""
ISSUE_NUMBER=""
ARGS=()
i=1
while [ $i -le $# ]; do
    arg="${!i}"
    case "$arg" in
        --json) 
            JSON_MODE=true 
            ;;
        --short-name)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            SHORT_NAME="$next_arg"
            ;;
        --type)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --type requires a value (feat, fix, ci, docs)' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --type requires a value (feat, fix, ci, docs)' >&2
                exit 1
            fi
            # Validate type
            case "$next_arg" in
                feat|fix|ci|docs|refactor|test|chore)
                    BRANCH_TYPE="$next_arg"
                    ;;
                *)
                    echo "Error: --type must be one of: feat, fix, ci, docs, refactor, test, chore" >&2
                    exit 1
                    ;;
            esac
            ;;
        --issue)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --issue requires a GitHub issue number' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --issue requires a GitHub issue number' >&2
                exit 1
            fi
            # Validate it's a number
            if ! [[ "$next_arg" =~ ^[0-9]+$ ]]; then
                echo "Error: --issue must be a number (GitHub issue #)" >&2
                exit 1
            fi
            ISSUE_NUMBER="$next_arg"
            ;;
        --number)
            # Legacy flag — still accepted but maps to --issue
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            ISSUE_NUMBER="$next_arg"
            ;;
        --help|-h) 
            echo "Usage: $0 [--json] [--type <type>] [--issue <number>] [--short-name <name>] <feature_description>"
            echo ""
            echo "Options:"
            echo "  --json              Output in JSON format"
            echo "  --type <type>       Branch type: feat, fix, ci, docs, refactor, test, chore (required)"
            echo "  --issue <number>    GitHub issue number (required)"
            echo "  --short-name <name> Provide a custom short name (2-3 words) for the branch"
            echo "  --help, -h          Show this help message"
            echo ""
            echo "Branch name format: <type>/<issue#>-<short-description>"
            echo ""
            echo "Examples:"
            echo "  $0 --type feat --issue 12 --short-name 'learn-page' 'Add learn page component'"
            echo "  $0 --type fix --issue 45 'Fix payment processing timeout'"
            exit 0
            ;;
        *) 
            ARGS+=("$arg") 
            ;;
    esac
    i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]}"
if [ -z "$FEATURE_DESCRIPTION" ]; then
    echo "Usage: $0 [--json] [--type <type>] [--issue <number>] [--short-name <name>] <feature_description>" >&2
    exit 1
fi

# Validate required arguments
if [ -z "$BRANCH_TYPE" ]; then
    echo "Error: --type is required (feat, fix, ci, docs, refactor, test, chore)" >&2
    exit 1
fi

if [ -z "$ISSUE_NUMBER" ]; then
    echo "Error: --issue is required (GitHub issue number)" >&2
    exit 1
fi

# Function to find the repository root by searching for existing project markers
find_repo_root() {
    local dir="$1"
    while [ "$dir" != "/" ]; do
        if [ -d "$dir/.git" ] || [ -d "$dir/.specify" ]; then
            echo "$dir"
            return 0
        fi
        dir="$(dirname "$dir")"
    done
    return 1
}

# Function to clean and format a branch name segment
clean_branch_name() {
    local name="$1"
    echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Resolve repository root
SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

REPO_ROOT="$(find_repo_root "$SCRIPT_DIR")"
if [ -z "$REPO_ROOT" ]; then
    echo "Error: Could not determine repository root. Please run this script from within the repository." >&2
    exit 1
fi

if git rev-parse --show-toplevel >/dev/null 2>&1; then
    HAS_GIT=true
else
    HAS_GIT=false
fi

cd "$REPO_ROOT"

SPECS_DIR="$REPO_ROOT/specs"
mkdir -p "$SPECS_DIR"

# Function to generate short description from feature description
generate_branch_name() {
    local description="$1"
    
    # Common stop words to filter out
    local stop_words="^(i|a|an|the|to|for|of|in|on|at|by|with|from|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|may|might|must|shall|this|that|these|those|my|your|our|their|want|need|add|get|set|create|implement|build|make)$"
    
    # Convert to lowercase and split into words
    local clean_name=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/ /g')
    
    # Filter words: remove stop words and keep meaningful words
    local meaningful_words=()
    for word in $clean_name; do
        [ -z "$word" ] && continue
        
        if ! echo "$word" | grep -qiE "$stop_words"; then
            if [ ${#word} -ge 3 ]; then
                meaningful_words+=("$word")
            elif echo "$description" | grep -q "\b${word^^}\b"; then
                meaningful_words+=("$word")
            fi
        fi
    done
    
    # Use first 2 meaningful words (concise two-word description)
    if [ ${#meaningful_words[@]} -gt 0 ]; then
        local max_words=2
        
        local result=""
        local count=0
        for word in "${meaningful_words[@]}"; do
            if [ $count -ge $max_words ]; then break; fi
            if [ -n "$result" ]; then result="$result-"; fi
            result="$result$word"
            count=$((count + 1))
        done
        echo "$result"
    else
        # Fallback to original logic
        local cleaned=$(clean_branch_name "$description")
        echo "$cleaned" | tr '-' '\n' | grep -v '^$' | head -2 | tr '\n' '-' | sed 's/-$//'
    fi
}

# Generate branch suffix (short description)
if [ -n "$SHORT_NAME" ]; then
    BRANCH_SUFFIX=$(clean_branch_name "$SHORT_NAME")
else
    BRANCH_SUFFIX=$(generate_branch_name "$FEATURE_DESCRIPTION")
fi

# Build branch name: {type}/{issue#}-{description}
BRANCH_NAME="${BRANCH_TYPE}/${ISSUE_NUMBER}-${BRANCH_SUFFIX}"

# GitHub enforces a 244-byte limit on branch names
MAX_BRANCH_LENGTH=244
if [ ${#BRANCH_NAME} -gt $MAX_BRANCH_LENGTH ]; then
    # Calculate max suffix length accounting for: type/ + issue# + hyphen
    PREFIX_LEN=$(( ${#BRANCH_TYPE} + 1 + ${#ISSUE_NUMBER} + 1 ))
    MAX_SUFFIX_LENGTH=$((MAX_BRANCH_LENGTH - PREFIX_LEN))
    
    TRUNCATED_SUFFIX=$(echo "$BRANCH_SUFFIX" | cut -c1-$MAX_SUFFIX_LENGTH)
    TRUNCATED_SUFFIX=$(echo "$TRUNCATED_SUFFIX" | sed 's/-$//')
    
    ORIGINAL_BRANCH_NAME="$BRANCH_NAME"
    BRANCH_NAME="${BRANCH_TYPE}/${ISSUE_NUMBER}-${TRUNCATED_SUFFIX}"
    
    >&2 echo "[specify] Warning: Branch name exceeded GitHub's 244-byte limit"
    >&2 echo "[specify] Original: $ORIGINAL_BRANCH_NAME (${#ORIGINAL_BRANCH_NAME} bytes)"
    >&2 echo "[specify] Truncated to: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
fi

if [ "$HAS_GIT" = true ]; then
    git checkout -b "$BRANCH_NAME"
else
    >&2 echo "[specify] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME"
fi

# Spec directory uses the full branch name (with slashes converted to dirs)
FEATURE_DIR="$SPECS_DIR/${ISSUE_NUMBER}-${BRANCH_SUFFIX}"
mkdir -p "$FEATURE_DIR"

TEMPLATE="$REPO_ROOT/.specify/templates/spec-template.md"
SPEC_FILE="$FEATURE_DIR/spec.md"
if [ -f "$TEMPLATE" ]; then cp "$TEMPLATE" "$SPEC_FILE"; else touch "$SPEC_FILE"; fi

# Set the SPECIFY_FEATURE environment variable for the current session
export SPECIFY_FEATURE="$BRANCH_NAME"

if $JSON_MODE; then
    printf '{"BRANCH_NAME":"%s","SPEC_FILE":"%s","ISSUE_NUMBER":"%s","BRANCH_TYPE":"%s","FEATURE_DIR":"%s"}\n' "$BRANCH_NAME" "$SPEC_FILE" "$ISSUE_NUMBER" "$BRANCH_TYPE" "$FEATURE_DIR"
else
    echo "BRANCH_NAME: $BRANCH_NAME"
    echo "SPEC_FILE: $SPEC_FILE"
    echo "ISSUE_NUMBER: $ISSUE_NUMBER"
    echo "BRANCH_TYPE: $BRANCH_TYPE"
    echo "SPECIFY_FEATURE environment variable set to: $BRANCH_NAME"
fi
